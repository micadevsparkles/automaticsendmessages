document.getElementById('btnGerar').addEventListener('click', processarContatos);
document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('inputContatos').value = '';
    document.getElementById('containerBotoes').innerHTML = '';
    document.getElementById('stats').innerText = '';
});

function processarContatos() {
    const rawText = document.getElementById('inputContatos').value;
    const container = document.getElementById('containerBotoes');
    const stats = document.getElementById('stats');
    const dddPadrao = "84";
    
    container.innerHTML = ''; 

    const mensagemBase = "Chamada%20Especial%3A%20Outlet%20Natal%20Hair!%20%E2%9C%A8%20%E2%80%8BPreparem%20o%20cora%C3%A7%C3%A3o%20(e%20as%20malas!)%2C%20porque%20o%20primeiro%20outlet%20do%20ano%20est%C3%A1%20chegando!%20A%20Faf%C3%A1%20Medeiros%20Produ%C3%A7%C3%B5es%20convida%20voc%C3%AA%20para%20dois%20dias%20incr%C3%ADveis%20de%20muitas%20novidades%20e%20pre%C3%A7os%20imperd%C3%ADveis.%20%F0%9F%9B%8D%EF%B8%8F%20%E2%80%8Bnos%20%20Dias%2022%20e%2023%20de%20mar%C3%A7o.%20%F0%9F%95%90%20%20Das%2013h%20%C3%A0s%2021h.%20%F0%9F%93%8D%20no%20%20Praia%20Shopping%20%E2%80%93%20Avenida%20Engenheiro%20Roberto%20Freire%2C%20com%20aquele%20acesso%20super%20f%C3%A1cil%20que%20voc%C3%AA%20j%C3%A1%20conhece!%20%20%E2%80%8BVenha%20conferir%20as%20melhores%20ofertas%20em%20um%20ambiente%20maravilho%20%E2%80%8BN%C3%A3o%20perca%20essa%20oportunidade!%20Esperamos%20por%20voc%C3%AAs!%20%F0%9F%92%83%E2%9C%A8%20%E2%80%8B";

    // 1. EXTRAÇÃO: Busca por qualquer sequência de números que tenha entre 8 e 15 dígitos
    // O regex /\d{8,15}/g ignora letras e foca apenas nos blocos de números
    const blocosNumericos = rawText.match(/\d{8,15}/g) || [];
    
    let contatosProcessados = [];

    blocosNumericos.forEach(bloco => {
        let num = bloco;

        // Remove o zero à esquerda se houver (ex: 084...)
        if (num.startsWith('0')) num = num.substring(1);

        // REGRA 1: Se o número for muito grande e começar com 55, isolamos ele
        // Se não começar com 55 e tiver 8 ou 9 dígitos, é o número puro
        // Se tiver 10 ou 11, é DDD + Número

        // Normalização: Vamos tentar deixar todos no formato DDD + Numero (10 ou 11 digitos)
        if (num.startsWith('55')) {
            num = num.substring(2);
        }

        // Se após tirar o 55 sobrou apenas o número (8 ou 9 dígitos), adiciona DDD 84
        if (num.length === 8 || num.length === 9) {
            num = dddPadrao + num;
        }

        // REGRA 2: Garantir o dígito 9
        // Agora o 'num' deve ser DDD + Restante.
        let ddd = num.substring(0, 2);
        let resto = num.substring(2);

        if (resto.length === 8) {
            num = ddd + '9' + resto;
        }

        // REGRA 3: Finalização com prefixo 55
        const resultadoFinal = "55" + num;

        // Validação final: precisa ter 13 dígitos
        if (resultadoFinal.length === 13) {
            contatosProcessados.push(resultadoFinal);
        }
    });

    // Remover duplicatas
    const listaLimpa = [...new Set(contatosProcessados)];

    if (listaLimpa.length === 0) {
        stats.innerText = "Nenhum número válido encontrado. Certifique-se de que os números têm DDD.";
        return;
    }

    stats.innerText = `${listaLimpa.length} contatos prontos para envio:`;

    // Criar botões
    listaLimpa.forEach(tel => {
        const link = document.createElement('a');
        link.href = `https://wa.me/${tel}?text=${mensagemBase}`;
        link.target = "_blank";
        link.className = "btn-contato";
        link.innerText = `Enviar para ${formatarMascara(tel)}`;
        
        link.addEventListener('click', function() {
            this.classList.add('clicado');
        });

        container.appendChild(link);
    });
}

function formatarMascara(t) {
    return `+${t.substring(0,2)} (${t.substring(2,4)}) ${t.substring(4,9)}-${t.substring(9)}`;
}
