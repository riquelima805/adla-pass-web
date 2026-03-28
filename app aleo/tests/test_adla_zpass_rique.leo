// The 'test_adla_zpass_rique' test program.
import adla_zpass_rique.aleo;
program test_adla_zpass_rique.aleo {
    @test
    script test_it() {
        let result: u32 = adla_zpass_rique.aleo/main(1u32, 2u32);
        assert_eq(result, 3u32);
    }

    @test
    @should_fail
    transition do_nothing() {
        let result: u32 = adla_zpass_rique.aleo/main(2u32, 3u32);
        assert_eq(result, 3u32);
    }
    
    @noupgrade
    async constructor() {}
}
