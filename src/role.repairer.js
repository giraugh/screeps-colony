const behaviourGather = require('behaviour.gather')
const roleUpgrader = require('role.upgrader')

const roleRepairer = creep => {
    const gathering = behaviourGather(creep, 'Repair', false)
    
    if (!gathering) {
        // Find stuff to repair
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < object.hitsMax
        }).sort((a, b) => a.hits - b.hits)
        if (targets.length > 0) {
            let target = targets[0]
            let err = creep.repair(target)
            if (err === ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        } else {
            // If nothing to repair then help upgrade
            roleUpgrader(creep)
        }
    }
}

module.exports = roleRepairer