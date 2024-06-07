export function initSlots(instance, children) {
    
    const slots = instance.slots = children || {};

    console.log('children',instance.slots);
    if(Array.isArray(slots)) {
         
    }

}