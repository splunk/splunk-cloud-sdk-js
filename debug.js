let instance = null;

var LOGGING_LEVELS = Object.freeze({
    CRITICAL: 50,
    ERROR: 40,
    WARNING: 30,
    INFO: 20,
    DEBUG: 10,
    NOTSET: 0,
});

// TODO: Documentation/Docstrings

// TODO: Is there a way to enforce the number of arguments provided to the
// "emit_event" function, for specific events without explicitly creating
// separate functions?
class EventEmittedNotEnoughArguments extends Error {
    constructor(message) {
        super(message);
    }
}
class EventNotDefinedError extends Error {
    constructor(message) {
        super(message);
    }
}
class LogLevelNotDefinedError extends Error {
    constructor(message) {
        super(message);
    }
}

class Debug {
    constructor() {
        this.event_listeners = {
            // Default event_listeners provided for debugging, these must be
            // defined here otherwise it won't be respected in the function call
            // requests - used for logging during requests to the API
            requests: [],
        };

        this.set_log_level('CRITICAL');
    }

    set_log_level(log_level) {
        let uppercase_log_level = log_level.toUpperCase();
        let is_log_level_defined = uppercase_log_level in LOGGING_LEVELS;

        if (!is_log_level_defined) {
            let error_message = `The log level "${uppercase_log_level}" is not
                                 defined.`;
            throw new LogLevelNotDefinedError(error_message);
            return;
        }

        this.level = LOGGING_LEVELS[uppercase_log_level];
    }

    // TODO: Circle back and force logging to go through the debug singleton to
    //       manage the logic for filtering severity levels
    // log(logging_level, message) {

    // }

    emit_event() {
        let does_event_have_enough_arguments = arguments.length > 0;
        let event_name = arguments[0];
        let does_event_exist = event_name in this.event_listeners;
        let event_listeners = this.event_listeners[event_name];

        // The arguments first  element is the event name which is not needed
        // Because `arguments` is a dictionary we need to filter out the first
        // element and then curry the rest of it into the events themselves
        // This is not "elegant", or easy to read.
        // let event_listener_arguments = {};
        let event_listener_arguments = [];
        for (const [key, value] of Object.entries(arguments)) {
            if (key !== '0') {
                // event_listener_arguments[(Number(key) - 1).toString()] = value;
                event_listener_arguments.push(value);
            }
        }

        if (!does_event_have_enough_arguments) {
            let error_message = `The "event_emit" function MUST be called with"
                                at least one argument - the event name`;
            throw new EventEmittedNotEnoughArguments(error_message);
            return;
        }
        if (!does_event_exist) {
            let error_message = `An event listener for the "${event_name}" event
                                does not exist`;
            throw new EventNotDefinedError(error_message);
            return;
        }

        // For debugging emitting
        // console.log('===================');
        // console.log(`arguments: ${JSON.stringify(arguments)}`);
        // console.log(`event_listener_arguments: ${JSON.stringify(event_listener_arguments)}`);
        // console.log(`Emitting the event: ${event_name}`);

        // event_listeners.map(event_listener => event_listener(event_listener_arguments));
        event_listeners.map(event_listener => event_listener(...event_listener_arguments));
    }

    on(event_name, new_listener) {
        let does_event_exist = event_name in this.event_listeners;

        if (!does_event_exist) {
            let error_message = `An event listener for the "${event_name}" event
                                does not exist`;
            throw new EventNotDefinedError(error_message);
            return;
        }

        let event_listener = this.event_listeners[event_name];
        event_listener.push(new_listener);
    }
}

function get_instance() {
    if (instance === null) {
        instance = new Debug();
    }

    return instance;
}

module.exports.Debug = get_instance();
