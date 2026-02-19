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
    
    container.innerHTML = ''; 

    const mensagemBase = "Chamada%20Especial%3A%20Outlet%20Natal%20Hair!%20%E2%9C%A8%20%E2%80%8BPreparem%20o%20cora%C3%A7%C3%A3o%20(e%20as%20malas!)%2C%20porque%20o%20primeiro%20outlet%20do%20ano%20est%C3%A1%20chegando!%20A%20Faf%C3%A1%20Medeiros%20Produ%C3%A7%C3%B5es%20convida%20voc%C3%AA%20para%20dois%20dias%20incr%C3%ADveis%20de%20muitas%20novidades%20e%20pre%C3%A7os%20imperd%C3%ADveis.%20%F0%9F%9B%8D%EF%B8%8F%20%E2%80%8Bnos%20%20Dias%2022%20e%2023%20de%20mar%C3%A7o.%20%F0%9F%95%90%20%20Das%2013h%20%C3%A0s%2021h.%20%F0%9F%93%8D%20no%20%20Praia%20Shopping%20%E2%80%93%20Avenida%20Engenheiro%20Roberto%20Freire%2C%20com%20aquele%20acesso%20super%20f%C3%A1cil%20que%20voc%C3%AA%20j%C3%A1%20conhece!%20%20%E2%80%8BVenha%20conferir%20as%20melhores%20ofertas%20em%20um%20ambiente%20maravilho%20%E2%80%8BN%C3%A3o%20perca%20essa%20oportunidade!%20Esperamos%20por%20voc%C3%AAs!%20%F0%9F%92%83%E2%9C%A8%20%E2%80%8B";

    // 1. Limpa o texto mantendo apenas números
    const apenasNumeros = rawText.replace(/\D/g, '');

    // 2. Tenta encontrar sequências que se pareçam com números de telefone
    // Vamos buscar blocos de 8 a 13 dígitos para tratar caso a caso
    const possiveisNumeros = apenasNumeros.match(/\d{8,13}/g) || [];
    let contatosFinais = [];

    possiveisNumeros.forEach(num => {
        let tratado = num;

        // Regra do Prefixo 55: Se não começa com 55, adiciona.
        // Nota: Verificamos se o tamanho sem o 55 faz sentido para evitar erros.
        if (!tratado.startsWith('55')) {
            tratado = '55' + tratado;
        }

        // Agora temos um número que começa com 55 + DDD + Restante
        // O DDD ocupa as posições de índice 2 e 3. O dígito 9 deve ser o índice 4.
        
        // Se após o 55 + DDD (4 dígitos) não houver o 9:
        if (tratado.charAt(4) !== '9') {
            // Verificamos se restam 8 dígitos após o DDD (índice 4 em diante)
            const resto = tratado.substring(4);
            if (resto.length === 8) {
                // Insere o 9 na posição correta
                tratado = tratado.substring(0, 4) + '9' + resto;
            }
        }

        // Validação Final: O número deve ter exatamente 13 dígitos (55 + DD + 9 + 8 dígitos)
        if (tratado.length === 13) {
            contatosFinais.push(tratado);
        }
    });

    // Remover duplicatas
    const listaLimpa = [...new Set(contatosFinais)];

    if (listaLimpa.length === 0) {
        stats.innerText = "Nenhum número válido de 13 dígitos pôde ser formado.";
        return;
    }

    stats.innerText = `${listaLimpa.length} contatos prontos para envio:`;

    // 3. Renderização dos Botões
    listaLimpa.forEach(tel => {
        const link = document.createElement('a');
        link.href = `https://wa.me/${tel}?text=${mensagemBase}`;
        link.target = "_blank";
        link.className = "btn-contato";
        // Exibe no botão o formato amigável: +55 (84) 9XXXX-XXXX
        link.innerText = `Enviar para ${formatarMascara(tel)}`;
        container.appendChild(link);
    });
}

function formatarMascara(t) {
    return `+${t.substring(0,2)} (${t.substring(2,4)}) ${t.substring(4,9)}-${t.substring(9)}`;
}
