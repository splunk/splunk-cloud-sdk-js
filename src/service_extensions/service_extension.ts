export type Constructor<T> = new(...args:any[]) => T;

/*
Service extensions give an opportunity to add functionality to a service. This is a little challenging as we may have
multiple versions of a service in the SDK at a time, but the extension needs to be applicable to each of them. To that
end an extension is implemented as a mixin, not a class. In order to make this work, we need a couple extra interfaces.
The first is an interface that describes the extensions themselves- it should list each new method that will be added
to the class when mixed in. This in turn is used to describe the resultant class- the resultant class fulfills both the
interface of the original service, and the extension mixin. The second required interface documents the functionality
that we expect of the service in order to let the extension work. For example, waiting for a job requires polling
the job's status. To get access to the status call in the extension, we declare the signature of the call in an
interface, and then require that a class passed in to have a mixin applied matches that interface. As long as that
endpoint stays the same (or close enough to match the interface), we will be able to apply the extension mixin. If
there is a new version that changes this contract, the module will not build as that class won't meet the conditions
of the interface.

These interfaces should be as private as possible, and as minimal as possible. As the build will break anytime
the interface doesn't match the service, only the endpoints that are required for the functioning of the extension
should be listed.
 */

export function delay(pollInterval: number) {
    return new Promise(resolve => {
        setTimeout(resolve, pollInterval);
    });
}
