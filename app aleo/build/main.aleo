program adla_zpass_rique.aleo;

record ZPass:
    owner as address.private;
    name_hash as field.private;
    is_adult as boolean.private;

function mint_zpass:
    input r0 as u16.private;
    input r1 as u16.private;
    input r2 as field.private;
    sub r1 r0 into r3;
    gte r3 18u16 into r4;
    assert.eq r4 true;
    cast self.caller r2 true into r5 as ZPass.record;
    output r5 as ZPass.record;

constructor:
    assert.eq edition 0u16;
