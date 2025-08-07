const user = {
    id: 1,
    type: 'user',
    name: 'joe'
} as const;


console.log(typeof user)

const aliases = ['joe', 'joey'] as const;

