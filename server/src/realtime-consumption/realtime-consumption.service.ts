import { Injectable, OnModuleInit } from '@nestjs/common';
import { Subject } from 'rxjs';
import { LogsService } from '../logs/logs.service';
import { Log, PRT } from '../logs/schemas/log.schema';
import { CollegesPowersService } from '../colleges-powers/colleges-powers.service';
import { CollegesService } from '../colleges/colleges.service';
import { PowersService } from '../powers/powers.service';
import { Types } from 'mongoose';


type range = [number, number];

function getNumber([start, end]: range) {
    let len = end - start;

    return Math.random() * len + start;
}

var cp: CollegesPowersService;


@Injectable()
export class RealtimeConsumptionService implements OnModuleInit {
    constructor(
        private collegeService: CollegesService,
        private powersService: PowersService,
        private collegesPowersConsumption: CollegesPowersService,
        private logsService: LogsService,
    ) { }

    async onModuleInit() {
        cp = this.collegesPowersConsumption;

        let cps = await this.collegesPowersConsumption.getEverything();

        for (let cp of cps) {
            const { college, power } = cp;
            const [collegeId, powerId] = [college.toString(), power.toString()];
            const { minSpan, maxSpan, minAmt, maxAmt, warn, err, active } = cp;
            const opts = { minSpan, maxSpan, minAmt, maxAmt, warn, err, active};

            let map = this.settings.get(collegeId) ||
                this.settings.set(collegeId, new Map()).get(collegeId);

            map.set(powerId, opts);
        }

        this.collegesPowersConsumption.updates
            .asObservable()
            .subscribe((collegeId) => {
                this.refreshSettings(collegeId);
            });

        this.collegeService.updates
            .asObservable()
            .subscribe((collegeId) => this.refreshCollegeNames(collegeId));

        this.powersService.updates
            .asObservable()
            .subscribe((powerId) => this.refreshPowerNames(powerId));

        this.collegeService.deletes
            .asObservable()
            .subscribe((collegeId) => this.deleteFromSettings(collegeId));

        await this.generateAll();
    }

    settings = new Map<any, any>();

    // generators stores the generating operations for each unit (college-power)
    generators = new Map<any, any>();

    // getGen is just an easier way to access generators' items
    getGen(collegeId: string, powerId: string) {
        const collegeBucket = this.generators.get(collegeId) ||
            this.generators.set(collegeId, new Map()).get(collegeId);

        if (!collegeBucket.get(powerId))
            collegeBucket.set(powerId, {
                subject: new Subject(),
                timerId: null
            });

        return collegeBucket.get(powerId);
    }

    warnSet = new Set<any>();
    collegeNames = new Map<any, any>();
    powerNames = new Map<any, any>();
    // genrators: Set<Set<Subject<number>> = Set<Set<Subject<number>>();


    deleteFromSettings(collegeId: any) {
        this.generators.delete(collegeId.toString());
    }

    async generateAll() {
        console.log('RealtimeConsumptionService: generateAll: starting..');
        let colleges = await this.collegeService.findAllColleges();

        for (let { _id, name: cName } of colleges) {
            const collegeId = _id.toString();
            this.collegeNames.set(collegeId, cName);
            let powers = await this.collegesPowersConsumption.findPowersByCollege(_id);


            for (let { _id, name: pName } of powers) {
                const powerId = _id.toString();
                this.powerNames.set(powerId, pName);
                const { active } =  this.settings.get(collegeId).get(powerId);
                if (active)
                    this.createGen(collegeId, powerId);
            }
        }
    }

    // NOTE: convert to 'college-power' collection
    async generateAllBak() {
        console.log('RealtimeConsumptionService: Generate all');
        let colleges = await this.collegeService.findAllColleges()
        for (let { _id, name: cName } of colleges) {
            const collegeId = _id.toString();
            this.collegeNames.set(collegeId, cName);
            let powers = await this.collegesPowersConsumption.findPowersByCollege(_id);

            let powersMap = new Map<string, any>();
            this.generators.set(
                collegeId,
                powersMap
            );
            for (let { _id, name: pName } of powers) {
                const powerId = _id.toString();
                this.powerNames.set(powerId, pName);
                let obj = {
                    subject: new Subject(),
                    timerId: null
                };

                const settings = this.settings;
                const logs = this.logsService;
                let warnSet = this.warnSet;

                const { active } = settings.get(collegeId).get(powerId);
                if (active) {
                    setTimeout(async function cb() {
                        const { minSpan, maxSpan, minAmt, maxAmt, warn, err } =
                            settings.get(collegeId).get(powerId);
                        const value = getNumber([minAmt, maxAmt]);

                        const prt = value >= err ? PRT.Err :
                            value >= warn ? PRT.Warn :
                                PRT.Info;

                        const log: Log = {
                            type: prt,
                            content: `[${cName} - ${pName}] crossed ${PRT[prt]} constraint`,
                            date: new Date(),
                        };

                        if (prt === PRT.Warn) {
                            if (!warnSet.has(`${collegeId}-${powerId}`)) {
                                warnSet.add(`${collegeId}-${powerId}`);
                                logs.push(log);
                            }
                        } else if (prt === PRT.Err) {
                            const active = false;
                            settings.get(collegeId).get(powerId).active = active;
                            await cp.updateCollegePower(
                                collegeId, powerId,
                                settings.get(collegeId).get(powerId)
                            );
                            logs.push(log);
                            return;
                        }

                        obj.subject.next(value);
                        obj.timerId = setTimeout(cb, getNumber([minSpan, maxSpan]) * 1000);
                    }, 0);

                }


                powersMap.set(powerId, obj);
            }
        }
    }

    observe(college: any, power: any) {
        return this.generators.get(college).get(power).subject.asObservable();
    }

    async refreshSettings(collegeId: any) {
        let cps = await this.collegesPowersConsumption.getEverything();
        let res = cps.filter(({ college }) => college.toString() === collegeId.toString())

        res.forEach(cp => {
            const { minSpan, maxSpan, minAmt, maxAmt, warn, err, active } = cp;
            const opts = { minSpan, maxSpan, minAmt, maxAmt, warn, err, active };
            const powerId = cp.power.toString();

            let map = this.settings.get(collegeId) ||
                this.settings.set(collegeId, new Map()).get(collegeId);

            map.set(powerId, opts);

            let gen = this.getGen(collegeId.toString(), powerId.toString());
            clearTimeout(gen.timerId);
            if (active)
                gen.timerId = this.createGen(collegeId, powerId);

            if (this.warnSet.has(`${collegeId}-${powerId}`))
                this.warnSet.delete(`${collegeId}-${powerId}`);
        })
    }

    async refreshCollegeNames(collegeId: Types.ObjectId) {
        const { name } = await this.collegeService.findOne(collegeId);
        this.collegeNames.set(collegeId.toString(), name);

    }

    async refreshPowerNames(powerId: Types.ObjectId) {
        const { name } = await this.powersService.findOne(powerId);
        this.powerNames.set(powerId.toString(), name);

    }

    async refreshGenerators(collegeId: any) {
        (await this.collegesPowersConsumption.findAllByCollege(collegeId)).forEach(cp => {
            const colBucket = this.generators.get(collegeId.toString());
            if (!colBucket)
                throw new Error(
                    `RealtimeConsumptionService: Unknown property of 'generators': ${collegeId.toString()}`
                );
            const bucket = colBucket.get(cp.power.toString());
            if (!bucket)
                throw new Error(
                    `RealtimeConsumptionService: Unknown property of 'generators': ${cp.power.toString()}`
                );

            if (!cp.active) {
                if (bucket.timerId) {
                    clearTimeout(bucket.timerId);
                    bucket.timerId = null;
                }
            } else {
                if (!bucket.timerId) {
                    bucket.timerId = this.createGen(
                        collegeId.toString(),
                        cp.power.toString()
                    );
                }
            }
        });

    }

    createGen(collegeId: any, powerId: any) {
        // const gen = this.generators.get(collegeId).get(powerId);
        const gen = this.getGen(collegeId.toString(), powerId.toString());
        const settings = this.settings;
        const logs = this.logsService;
        let warnSet = this.warnSet;
        const cName = this.collegeNames.get(collegeId) || "COLLEGE";
        const pName = this.powerNames.get(powerId) || "RESOURCE";

        return setTimeout(async function cb() {
            const { minSpan, maxSpan, minAmt, maxAmt, warn, err } =
                settings.get(collegeId).get(powerId);
            const value = getNumber([minAmt, maxAmt]);

            const prt = value >= err ? PRT.Err :
                value >= warn ? PRT.Warn :
                    PRT.Info;

            const log: Log = {
                type: prt,
                content: `[${cName} - ${pName}] crossed ${PRT[prt]} constraint`,
                date: new Date(),
            };

            if (prt === PRT.Warn) {
                if (!warnSet.has(`${collegeId}-${powerId}`)) {
                    warnSet.add(`${collegeId}-${powerId}`);
                    logs.push(log);
                }
            } else if (prt === PRT.Err) {
                const active = false;
                settings.get(collegeId).get(powerId).active = active;
                await cp.updateCollegePower(
                    collegeId, powerId,
                    settings.get(collegeId).get(powerId)
                );
                logs.push(log);
                return;
            }

            gen.subject.next(value);
            gen.timerId = setTimeout(cb, getNumber([minSpan, maxSpan]) * 1000);
        }, 0);
    }


}
