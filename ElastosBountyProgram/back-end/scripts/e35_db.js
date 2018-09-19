
// MAKE SURE YOU RUN BUILD BEFORE THIS

// this is what sets the process.env
const _ = require('lodash')
require('../dist/src/config');

(async () => {

    const db = await require('../dist/src/db').default
    const DB = await db.create()

    const db_team = DB.getModel('Team')

    try {
        const teams = [
            {
                profile: {
                    description: ""
                },
                tags: [],
                domain: [],
                recruitedSkillsets: [],
                members: [new ObjectId("dlsaldas")],
                name: "Team Name",
                metadata: {},
                owner: new ObjectId("sadasdsa"),
                pictures: [],
                type: "CRCLE"
            }
        ]

        let updated = 0
        for (const team in teams) {
            const res = await db_team.update({ name: team.name },
                {
                    profile: { description: team.profile.description },
                    tags: team.tags,
                    domain: team.domain,
                    recruitedSkillsets: team.recruitedSkillsets,
                    members: team.members,
                    name: team.name,
                    metadata: team.metadata,
                    owner: team.owner,
                    pictures: team.pictures,
                    type: team.type
                }, { upsert: true })
            if (res.nModified === 1) {
                updated = updated + 1
            }
            else if(res.n !== 1 && res.n !== 0) {
                console.log("Warning! More than 1 entries have been modified")
            }
        }

        console.log(updated + " teams have been added/modified")
    } catch (err) {
        console.error(err)
    }

    process.exit(1)
})()