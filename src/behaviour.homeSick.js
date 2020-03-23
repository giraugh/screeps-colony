const behaviourHomeSick = (creep, masterSpawn) => {
    const r = masterSpawn.pos.getRangeTo(creep.pos)
    if (creep.room !== masterSpawn.room) {
        creep.say('🏠')
        creep.moveTo(masterSpawn)
    }
}

module.exports = behaviourHomeSick