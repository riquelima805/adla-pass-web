🎵 Adla Pass
Este é o repositório oficial do Adla Pass, o sistema de identidade descentralizada do Adla Music.
A ideia aqui é resolver dois problemas: votos de bots em enquetes e obedecer às normas da nossa legislação, onde menores de 18 anos não podem ter acesso a certas coisas.
Pensamos em usar o SDK zPass, no qual o usuário faria um KYC completo, mas ele foi descontinuado. Como é só para provar que é humano e validar a idade, não foi necessário algo muito avançado.
Nosso fluxo é assim:
O usuário loga usando o Privy (atualmente ativo para e-mail).
O usuário conecta sua wallet interna do app (este repositório está configurado para Leo Wallet).
A prova ZK: ele digita o nome e o ano de nascimento; transformamos isso em um hash.
Nosso contrato recebe esse hash e, caso o usuário seja maior de 18 anos, ele cunha o NFT e o usuário o recebe em sua carteira.
Apenas um comprovante matemático é registrado na blockchain; nenhum dado é exposto. Nenhum dado fica armazenado em nossos servidores também.
