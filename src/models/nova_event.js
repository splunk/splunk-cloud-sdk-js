function deswizzleTime(time) {
    if (time instanceof Date) {
        return time.valueOf();
    }

    if (typeof time === 'string') {
        return Date.parse(time).valueOf();
    }

    if (typeof time === 'number') {
        return time;
    }

    // TODO: better message
    throw Error('Unable to determine time');
}

class NovaEvent {
    constructor(entity) {
        this.entity = entity;
    }

    static build(entity) {
        return new NovaEvent(entity);
    }

    withTime(time) {
        this.time = deswizzleTime(time);
        return this;
    }

    withSource(source) {
        this.source = source;
        return this;
    }

    withField(fieldName, value) {
        this[fieldName] = value;
        return this;
    }

    /* eslint-disable */
    withFields(args) {
        for (var key in args) {
            this[key] = args[key];
        }
        return this;
    }
}

module.exports = NovaEvent;
