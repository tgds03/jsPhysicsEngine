Math.degtorad = Math.PI / 180;
Math.radtodeg = 180 / Math.PI;
Math.isEqual = (a, b) => { return (Math.abs(a-b) < Number.EPSILON); }