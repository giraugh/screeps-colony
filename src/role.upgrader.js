const behaviourGather = require('behaviour.gather')

const roleUpgrader = creep => {
    const gathering = behaviourGather(creep, 'Upgrade', false)
    
    if (!gathering) {
        // We should deliver it to things
        let err = creep.upgradeController(creep.room.controller)
        if (err === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, { visualisePathStyle: { stroke: 'green' } })
        }
    }
}

module.exports = roleUpgrader