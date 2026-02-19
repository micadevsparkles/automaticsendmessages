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

    // Extrai blocos de números que podem ser telefones (de 8 a 13 dígitos)
    const numerosLimpos = rawText.replace(/\D/g, ' '); // Troca o que não é número por espaço
    const candidatos = numerosLimpos.split(/\s+/).filter(n => n.length >= 8);
    
    let contatosFinais = [];

    candidatos.forEach(original => {
        let num = original;

        // 1. TRATAMENTO DE DDD AUSENTE
        // Se o número tem 8 ou 9 dígitos, assumimos que falta o DDD (84)
        if (num.length === 8 || num.length === 9) {
            num = dddPadrao + num;
        }

        // 2. TRATAMENTO DO PREFIXO PAÍS (55)
        // Se após o passo acima o número não começar com 55, adicionamos
        if (!num.startsWith('55')) {
            num = '55' + num;
        }

        // 3. TRATAMENTO DO NONO DÍGITO
        // Agora o número deve ter 55 + DDD + RESTO. 
        // O dígito 9 obrigatório deve estar na posição de índice 4.
        
        let prefixoPaisEDDD = num.substring(0, 4); // Pega o "5584" (ou outro DDD)
        let resto = num.substring(4); // Pega tudo que vem depois do DDD

        // Se o que restou tem 8 dígitos, significa que o 9 está faltando
        if (resto.length === 8) {
            num = prefixoPaisEDDD + '9' + resto;
        } 
        // Se o usuário digitou o 55 + DDD e começou com 9, mas no total deu menos que 13
        // Ex: 55 84 9 1234 567 (total 12) -> Isso indica que o número está incompleto ou mal formatado.
        // O código abaixo garante que ele tenha 13 ao final.

        // Validação rigorosa: Só gera botão se tiver exatamente 13 dígitos
        if (num.length === 13) {
            contatosFinais.push(num);
        }
    });

    const listaUnica = [...new Set(contatosFinais)];

    if (listaUnica.length === 0) {
        stats.innerText = "Nenhum número válido pôde ser processado. Verifique os dígitos.";
        return;
    }

    stats.innerText = `${listaUnica.length} contatos prontos:`;

    listaUnica.forEach(tel => {
        const link = document.createElement('a');
        link.href = `https://wa.me/${tel}?text=${mensagemBase}`;
        link.target = "_blank";
        link.className = "btn-contato";
        link.innerText = `Enviar para ${formatarMascara(tel)}`;
        container.appendChild(link);
    });
}

function formatarMascara(t) {
    return `+${t.substring(0,2)} (${t.substring(2,4)}) ${t.substring(4,9)}-${t.substring(9)}`;
}
