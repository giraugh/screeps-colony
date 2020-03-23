const behaviourGather = require('behaviour.gather')

const roleHarvester = creep => {
    const gathering = behaviourGather(creep, 'Distribute', true)
    
    if (!gathering) {
        // We should deliver it to things
        let dests = creep.room.find(FIND_STRUCTURES, {
            filter: ({ structureType, store }) =>
                [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_CONTAINER].includes(structureType) &&
                store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })
        if (dests.length > 0) {
            let target = dests[0]
            let err = creep.transfer(target, RESOURCE_ENERGY)
            if (err === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualisePathStyle: { stroke: 'blue' } })
            }
        } else {
            // Ig just go to spawn and drop resources
            let spawns = creep.room.find(FIND_STRUCTURES, { filter: ({ structureType }) => structureType === STRUCTURE_SPAWN })
            if (spawns.length > 0) {
                creep.moveTo(spawns[0])
            }
            
            // we close to spawn?
            let range = creep.pos.getRangeTo(spawns[0])
            if (range < 2) {
                creep.drop(RESOURCE_ENERGY)
            }
        }
    }
}

module.exports = roleHarvester