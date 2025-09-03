import mongoose from "mongoose";
export declare const userModel: mongoose.Model<{
    username: string;
    password: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    username: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    username: string;
    password: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    username: string;
    password: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const tagModel: mongoose.Model<{
    title: string;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    title: string;
}, {}, mongoose.DefaultSchemaOptions> & {
    title: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    title: string;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    title: string;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    title: string;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const contentModel: mongoose.Model<{
    tags: mongoose.Types.DocumentArray<{
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }> & {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }>;
    type?: unknown;
    title?: unknown;
    link?: unknown;
    userId?: {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    } | null;
    createdAt?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
        valueOf?: {} | null;
    } | null;
    isActive?: unknown;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    tags: mongoose.Types.DocumentArray<{
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }> & {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }>;
    type?: unknown;
    title?: unknown;
    link?: unknown;
    userId?: {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    } | null;
    createdAt?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
        valueOf?: {} | null;
    } | null;
    isActive?: unknown;
}, {}, mongoose.DefaultSchemaOptions> & {
    tags: mongoose.Types.DocumentArray<{
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }> & {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    }>;
    type?: unknown;
    title?: unknown;
    link?: unknown;
    userId?: {
        prototype?: unknown;
        cacheHexString?: unknown;
        generate?: any;
        createFromTime?: any;
        createFromHexString?: any;
        createFromBase64?: any;
        isValid?: any;
    } | null;
    createdAt?: {
        toJSON?: {} | null;
        [Symbol.toPrimitive]?: {} | null;
        toString?: {} | null;
        toLocaleString?: {} | null;
        toDateString?: {} | null;
        toTimeString?: {} | null;
        toLocaleDateString?: {} | null;
        toLocaleTimeString?: {} | null;
        getTime?: {} | null;
        getFullYear?: {} | null;
        getUTCFullYear?: {} | null;
        getMonth?: {} | null;
        getUTCMonth?: {} | null;
        getDate?: {} | null;
        getUTCDate?: {} | null;
        getDay?: {} | null;
        getUTCDay?: {} | null;
        getHours?: {} | null;
        getUTCHours?: {} | null;
        getMinutes?: {} | null;
        getUTCMinutes?: {} | null;
        getSeconds?: {} | null;
        getUTCSeconds?: {} | null;
        getMilliseconds?: {} | null;
        getUTCMilliseconds?: {} | null;
        getTimezoneOffset?: {} | null;
        setTime?: {} | null;
        setMilliseconds?: {} | null;
        setUTCMilliseconds?: {} | null;
        setSeconds?: {} | null;
        setUTCSeconds?: {} | null;
        setMinutes?: {} | null;
        setUTCMinutes?: {} | null;
        setHours?: {} | null;
        setUTCHours?: {} | null;
        setDate?: {} | null;
        setUTCDate?: {} | null;
        setMonth?: {} | null;
        setUTCMonth?: {} | null;
        setFullYear?: {} | null;
        setUTCFullYear?: {} | null;
        toUTCString?: {} | null;
        toISOString?: {} | null;
        getVarDate?: {} | null;
        valueOf?: {} | null;
    } | null;
    isActive?: unknown;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    type: string;
    title: string;
    link: string;
    tags: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    }[];
    userId: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    createdAt: NativeDate;
    isActive: boolean;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    type: string;
    title: string;
    link: string;
    tags: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    }[];
    userId: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    createdAt: NativeDate;
    isActive: boolean;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    type: string;
    title: string;
    link: string;
    tags: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    }[];
    userId: {
        prototype?: mongoose.Types.ObjectId | null;
        cacheHexString?: unknown;
        generate?: {} | null;
        createFromTime?: {} | null;
        createFromHexString?: {} | null;
        createFromBase64?: {} | null;
        isValid?: {} | null;
    };
    createdAt: NativeDate;
    isActive: boolean;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export declare const linkModel: mongoose.Model<{
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
}, {}, mongoose.DefaultSchemaOptions> & {
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    userId: mongoose.Types.ObjectId;
    createdAt: NativeDate;
    hash: string;
    contentId: mongoose.Types.ObjectId;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=db.d.ts.map