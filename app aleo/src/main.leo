program adla_zpass_rique.aleo {
    
   
    record ZPass {
        owner: address,
        name_hash: field,
        is_adult: bool,
    }

    
    @noupgrade
    async constructor() {
    }

    
    transition mint_zpass(birth_year: u16, current_year: u16, user_name_hash: field) -> ZPass {
        
        // verificamos a idade nescessario para seguir leis do pais
        assert(current_year - birth_year >= 18u16);
        
        
        return ZPass {
            owner: self.caller,
            name_hash: user_name_hash,
            is_adult: true,
        };
    }
}