const scoreSource = (creep, source) => {
    let score = 0
    
    // Lose score for req travel time
    let pathToCreep = creep.pos.findPathTo(source.pos)
    let pathDistToCreep = pathToCreep.length
    score -= pathDistToCreep
    
    // Lose score for inaccesability due to walls
    let walls = source.pos.findInRange(FIND_STRUCTURES, 2, { filter: ({ structureType }) => structureType === STRUCTURE_WALL })
    score -= 5 * walls.length
    
    console.log('Calculated score of ' + score+ ' for source at pos ' + source.pos.toString())
    console.log('Lost ' + pathDistToCreep + ' points for path dist')
    console.log('Lost ' + (5 * walls.length) + ' points for walls')
    
    return score
}

const behaviourGather = (creep, activity = 'Stop Gathering',  ignoreDrops = false) => {
    // Do we even know of gathering?
    if (creep.memory.gathering === undefined) {
        creep.memory.gathering = true
    }
    
    // Do we need energy?
    if (!creep.memory.gathering && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.gathering = true
        creep.say('Gather')
    }
    
    if (creep.memory.gathering && creep.store.getFreeCapacity() === 0) {
        creep.memory.gathering = false
        creep.memory.gatheringFrom = undefined
        creep.say(activity + '!')
    }
    
    
    if (creep.memory.gathering) {
        // Is there some thats dropped?
        const drops = creep.room.find(FIND_DROPPED_RESOURCES)
        if (drops.length > 0 && !ignoreDrops) {
            let drop = drops[0]
            let err = creep.pickup(drop)
            if (err === ERR_NOT_IN_RANGE) {
                creep.moveTo(drop, { maxRooms: 1 })
            }
        } else {
            // Are we already on our way?
            if (creep.memory.gatheringFrom) {
                let target = Game.getObjectById(creep.memory.gatheringFrom)
                let err = creep.harvest(target)
                if (err === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {
                        maxRooms: 1,
                        visualizePathStyle: { stroke: '#fff' }
                    })
                }
                if (err === ERR_INVALID_TARGET) {
                    creep.memory.gatheringFrom = undefined
                }
            } else {
                // Look for sources
                const sources = creep.room.find(FIND_SOURCES)
                const preferred = sources.sort((a,b) => scoreSource(creep, b) - scoreSource(creep, a))
                const target = preferred[0]
                console.log('Recalculated gather source')
                creep.memory.gatheringFrom = target.id
            }
        }
    }
    
    return creep.memory.gathering
}

module.exports = behaviourGather