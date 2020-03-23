import { ErrorMapper } from "utils/ErrorMapper";

const roleHarvester = require('role.harvester')
const roleUpgrader = require('role.upgrader')
const roleBuilder = require('role.builder')
const roleRepairer = require('role.repairer')

const behaviourHomeSick = require('behaviour.homeSick')

const ROLE_HARVESTER = 'harvester'
const ROLE_UPGRADER = 'upgrader'
const ROLE_BUILDER = 'builder'
const ROLE_REPAIRER = 'repairer'

const MASTER_SPAWN = 'spawn-master'

// #TODO:
// > make roles
//  - repairer: repairs structures when needed and otherwise helps gather energy
//  - architect: places structures such as storage and extensions
//  - paver: builds roads to sources for faster travel, also will repair roads

const creepRoles = {
    [ROLE_BUILDER]: { behaviour: roleBuilder, desiredPopulation: 3, bodyParts: [MOVE, CARRY, WORK] },
    [ROLE_REPAIRER]: { behaviour: roleRepairer, desiredPopulation: 1, bodyParts: [MOVE, CARRY, WORK] },
    [ROLE_UPGRADER]: { behaviour: roleUpgrader, desiredPopulation: 3, bodyParts: [MOVE, CARRY, WORK] },
    [ROLE_HARVESTER]: { behaviour: roleHarvester, desiredPopulation: 4, bodyParts: [MOVE, CARRY, WORK] },
}

module.exports.loop = ErrorMapper.wrapLoop(() => {
    // How is our population?
    for (let roleName of Object.keys(creepRoles)) {
        let role = creepRoles[roleName]
        let currentPopulation = _.filter(Game.creeps, { memory: {role: roleName } }).length
        let desiredPopulation = role.desiredPopulation
        if (currentPopulation < desiredPopulation) {
            let bParts = role.bodyParts
            const spawn = Game.spawns[MASTER_SPAWN]
            spawn.spawnCreep(bParts, (roleName + '#' + Game.time), { memory: { role: roleName } })
        }
    }

    // Clear up dead memory
    for (let i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i]
        }
    }

    // Perform roles
    for (let i in Game.creeps) {
        const creep = Game.creeps[i]

        // Are we ready?
        if (creep.spawning) continue;

        const role = creep.memory.role
        const behaviour = creepRoles[role].behaviour
        behaviour(creep)

        behaviourHomeSick(creep, Game.spawns[MASTER_SPAWN])
    }
}
