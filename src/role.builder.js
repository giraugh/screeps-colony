const behaviourGather = require('behaviour.gather')
const roleUpgrader = require('role.upgrader')

const roleBuilder = creep => {
    const gathering = behaviourGather(creep, 'Build', false)
    
    if (!gathering) {
        // We should build then
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES)
        if (sites.length > 0) {
            const target = sites[0]
            let err = creep.build(target)
            if (err === ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        } else {
            // If nothing to build then help upgrade
            roleUpgrader(creep)
        }
        
    }
}

module.exports = roleBuilder