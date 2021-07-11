

/**
 * Builds a sync function which calls a method found in the default export of another script.
 *
 * This method will always be sync, even if the export of the other method is async.
 */
export default function build(workerPath: string): (...args: any) => any;
