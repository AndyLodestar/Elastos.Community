import {Schema} from 'mongoose';

export const Region = {
    country: String,
    state: String,
    city: String
};
export const Contact = {
    type : Map,
    of : String
};

export const Profile = {
    firstName : String,
    lastName: String,

    avatar : String,
    avatarFilename: String,
    avatarFileType: String,

    gender : String,
    birth : Date,
    timezone: String,
    region: Region,

    country : String,
    state : String,
    city : String,

    telegram: String,
    reddit: String,
    wechat: String,
    twitter: String,
    facebook: String,

    beOrganizer : Boolean,
    isDeveloper : Boolean,

    source : String,
    walletAddress : String
};

export const WorkProject = {
    startTime : Date,
    endTime : Date,
    description : String,
    name : String
};

export const WorkAbout = {
    status: String, // employed, student, etc
    employment: String, // company if employed / school if student
    skill : [String],
    project : [WorkProject],
    resume : String,

    notes: String // private internal notes visible only to admin/council
};

// amount is ELA * 1000
export const ELA = {
    address: String,
    amount: Schema.Types.Number
};
export const VotePower = {
    amount: Number,
    expired: Date
};

export const User = {
    username : {
        type : String,
        required: true,
        index : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    salt: {
        type: String,
        required: true
    },

    // let's keep this on the root object
    email: String,
    profile : Profile,
    defaultLanguage: String,
    workAbout : WorkAbout,

    // resetToken, ensure this is never returned
    resetToken: String,

    // constants.USER_ROLE
    role : String,

    // constants.USER_EMPOWER
    empower: String,

    elaOwed : [ELA],

    notes: String, // private internal notes visible only to admin/council

    // admin or council approved max event budget, defaults to 0
    // decreases upon usage
    elaBudget: [ELA],

    votePower : [VotePower],
    votePowerAmount : {
        // TODO auto calculate with votePower
    },
    active : {
        type : Boolean,
        default : false
    },
    circles: [{type: Schema.Types.ObjectId, ref: 'team'}]
};
