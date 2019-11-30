/**
 * The property decorator creates an ngOnDestroy() method on the class containing
 * the decorated property. The created ngOnDestroy() method implementation checks
 * if the property value contains an unsubscribe() method and, if present, calls it.
 * If the property value is an array, instead it loops through the array elements
 * and calls their own unsubscribe() methods, if present. Finally, ngOnDestroy()
 * calls the original ngOnDestroy method declared by the class.
 *
 * The decorator is supposed to be used to decorate Angular directive class properties
 * containing RxJs subscriptions that need to be disposed of manually during directive
 * destruction.
 *
 * NOTE: This decorator does not work in AOT mode. It still requires an ngOnDestroy method to be declared.
 * Instead of doing that manually, you can extend a base Destroyable class.
 */
export function UnsubscribeOnDestroy(): PropertyDecorator {
    return function (target: any, key: string | symbol) {

        const original = target.constructor.prototype.ngOnDestroy;

        // TODO: While still using the View Engine (not Ivy) to compile code for production,
        // we should probably check if original === undefined in this place. If true, we should probably
        // throw some kind of an error (at least to the console), since the unsubscribe logic will not work in AOT.

        target.constructor.prototype.ngOnDestroy = function () {
            const value = this[key];

            if (Array.isArray(value)) {
                for (const element of value) {
                    unsubscribe(element);
                }
            } else {
                unsubscribe(value);
            }

            if (original && typeof original === 'function') {
                (original as Function).apply(this, arguments);
            }
        };
    };
}

function unsubscribe(propertyValue: any) {
    if (propertyValue === null || propertyValue === undefined) {
        return;
    } else if (typeof propertyValue.unsubscribe === 'function') {
        propertyValue.unsubscribe();
    } else {
        throw new Error('Property value does not contain unsubscribe method');
    }
}
