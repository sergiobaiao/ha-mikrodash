# MikroDash

1. Instale e inicie o add-on.
2. Veja o log do add-on: ele mostra o **setup code** da primeira execução.
3. Abra `http://IP-DO-HA:3081`, crie o admin com o código e adicione o roteador.

Dados persistem em `/data` do add-on (incluídos nos backups do HA).
Porta 13231/udp só é usada se ativar o provisionamento zero-touch.
Config do RouterOS: veja o README do projeto.
