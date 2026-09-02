/* =====================================================================
   questions.js — banco de exercícios
   Tipos: mc (múltipla escolha) · vf (verdadeiro/falso) · num (numérico)
          match (associação) · order (ordenar) · fill (completar fórmula)
   Níveis: 1 aquecimento · 2 entendimento · 3 aplicação · 4 desafio · 5 mestre
   ===================================================================== */

const QUESTIONS = [

/* ---------- CAP 4 · ESTADOS ---------- */
{
  id:"m-c4-1", topic:"estados", level:1, type:"mc",
  prompt:"Ao aquecer um sólido, o que acontece com suas partículas antes de ele fundir?",
  options:["Elas ficam paradas e mais organizadas","Elas vibram com mais intensidade em torno de posições fixas","Elas se transformam em outra substância","Elas perdem energia cinética"],
  answer:1,
  whyWrong:{0:"Aquecer nunca diminui a agitação: energia entrando significa mais movimento.",2:"Mudança de estado é fenômeno físico — a substância continua a mesma.",3:"Aquecer aumenta, e não diminui, a energia cinética média."},
  explain:"No sólido, as partículas ocupam posições fixas e apenas vibram. Aquecendo, a vibração aumenta até vencer as interações e o sólido fundir.",
  hint:"Energia entrando = movimento aumentando."
},
{
  id:"q-est-1", topic:"estados", level:1, type:"vf",
  prompt:"O gelo e o vapor d'água são substâncias químicas diferentes.",
  answer:false,
  explain:"São a mesma substância (H₂O) em estados físicos diferentes. Muda a organização das partículas, não a identidade química.",
  hint:"Mudança de estado é fenômeno físico."
},
{
  id:"q-est-2", topic:"estados", level:2, type:"match",
  prompt:"Associe cada estado físico à descrição correta.",
  pairs:[["Sólido","Forma e volume definidos"],["Líquido","Volume definido, forma variável"],["Gás","Nem forma nem volume definidos"]],
  explain:"O grau de liberdade das partículas cresce de sólido para gás: posições fixas → deslizando encostadas → praticamente livres.",
  hint:"Pense em quanta liberdade as partículas têm em cada caso."
},
{
  id:"q-est-3", topic:"estados", level:3, type:"mc",
  prompt:"Uma colher de metal e uma piscina estão ambas a 25 °C. Sobre elas é correto afirmar:",
  options:["A colher tem mais energia total porque o metal é mais denso","As duas têm a mesma energia total, pois a temperatura é igual","A piscina tem mais energia total, pois tem muito mais partículas","Nenhuma tem energia, pois não estão sendo aquecidas"],
  answer:2,
  whyWrong:{0:"Densidade não determina energia total; o número de partículas e a massa, sim.",1:"Temperatura mede a energia cinética *média* por partícula, não a energia total.",3:"Toda matéria acima de 0 K possui energia cinética."},
  explain:"Temperatura é média por partícula. A piscina tem um número muito maior de partículas, logo energia total muito maior.",
  hint:"Média por partícula ≠ soma de todas as partículas."
},

/* ---------- CAP 4 · MUDANÇAS ---------- */
{
  id:"m-c4-2", topic:"mudancas", level:1, type:"mc",
  prompt:"O gelo colocado no refrigerante esfria a bebida porque:",
  options:["transfere frio para o líquido","absorve energia do líquido para fundir","cria uma barreira térmica","aumenta a pressão dentro do copo"],
  answer:1,
  whyWrong:{0:"“Frio” não é uma substância que se transfere: o que se transfere é energia, e ela vai do mais quente para o mais frio.",2:"Não há barreira; há troca de energia.",3:"A pressão do copo aberto continua sendo a atmosférica."},
  explain:"A fusão é endotérmica: o gelo retira energia do líquido ao redor, que esfria.",
  hint:"Fusão absorve energia — de onde ela vem?"
},
{
  id:"q-mud-1", topic:"mudancas", level:1, type:"mc",
  prompt:"Qual conjunto reúne apenas transformações ENDOTÉRMICAS?",
  options:["Fusão, vaporização e sublimação","Solidificação, condensação e deposição","Fusão, condensação e sublimação","Vaporização, solidificação e deposição"],
  answer:0,
  whyWrong:{1:"Esse é exatamente o conjunto oposto: são todas exotérmicas.",2:"Condensação libera energia — não pertence ao grupo endotérmico.",3:"Solidificação e deposição liberam energia."},
  explain:"Sólido → líquido → gás é o caminho de aumento de energia: fusão, vaporização e sublimação absorvem energia.",
  hint:"Subiu de estado, absorveu."
},
{
  id:"q-mud-2", topic:"mudancas", level:2, type:"match",
  prompt:"Associe cada transformação ao seu par de estados.",
  pairs:[["Fusão","Sólido → Líquido"],["Condensação","Gás → Líquido"],["Sublimação","Sólido → Gás"],["Deposição","Gás → Sólido"]],
  explain:"Sublimação e deposição são caminhos diretos entre sólido e gás, em sentidos opostos.",
  hint:"Cuidado para não trocar sublimação com deposição."
},
{
  id:"q-mud-3", topic:"mudancas", level:2, type:"vf",
  prompt:"A naftalina que desaparece do armário sem molhar nada passou por sublimação.",
  answer:true,
  explain:"Sublimação é a passagem direta de sólido para gás, sem fase líquida — exatamente o que a naftalina faz na temperatura ambiente.",
  hint:"Sobrou poça no armário?"
},
{
  id:"q-mud-4", topic:"mudancas", level:3, type:"order",
  prompt:"Ordene as etapas do aquecimento de um cubo de gelo até virar vapor, do início ao fim.",
  items:["Aquecimento do gelo","Fusão do gelo","Aquecimento da água líquida","Vaporização da água","Aquecimento do vapor"],
  explain:"O sistema alterna entre aquecer uma fase (temperatura sobe) e mudar de fase (temperatura constante, energia usada nas interações).",
  hint:"Alternam-se rampas e patamares."
},

/* ---------- CAP 4 · DIAGRAMA DE FASES ---------- */
{
  id:"m-c4-3", topic:"diagrama", level:2, type:"mc",
  prompt:"No diagrama de fases, o que representa uma LINHA (curva de equilíbrio)?",
  options:["Uma região onde a substância é pura","Condições em que duas fases coexistem em equilíbrio","O limite máximo de temperatura da substância","Uma zona proibida para a substância"],
  answer:1,
  whyWrong:{0:"Pureza não é lida em regiões do diagrama; regiões indicam fases.",2:"O limite superior de temperatura é dado pelo ponto crítico, não por qualquer linha.",3:"Não existem regiões proibidas no diagrama."},
  explain:"Sobre a linha, as duas fases têm a mesma tendência de escape e coexistem em equilíbrio.",
  hint:"Região = uma fase. Linha = duas."
},
{
  id:"q-dia-1", topic:"diagrama", level:1, type:"mc",
  prompt:"O ponto triplo de uma substância corresponde a:",
  options:["a maior temperatura em que ela pode existir","a condição em que sólido, líquido e gás coexistem em equilíbrio","o ponto em que ela deixa de existir como líquido","a pressão em que ela sempre sublima"],
  answer:1,
  whyWrong:{0:"Esse é mais próximo do papel do ponto crítico.",2:"Isso descreve o ponto crítico, não o triplo.",3:"A sublimação depende de estar abaixo da pressão do ponto triplo, mas o ponto em si não é isso."},
  explain:"O ponto triplo é a única combinação de pressão e temperatura em que as três fases coexistem em equilíbrio.",
  hint:"Triplo = três fases juntas."
},
{
  id:"q-dia-2", topic:"diagrama", level:3, type:"mc",
  prompt:"Acima do ponto crítico, é correto afirmar que:",
  options:["a substância só pode existir como sólido","líquido e gás se tornam indistinguíveis e não há ebulição","a substância congela instantaneamente","a pressão de vapor se torna zero"],
  answer:1,
  whyWrong:{0:"Acima do ponto crítico a fase sólida não é o que está em jogo — a fronteira que desaparece é a de líquido e gás.",2:"Temperaturas acima da crítica são altas: congelar é o oposto do esperado.",3:"A pressão de vapor cresce com a temperatura; ela não zera."},
  explain:"Passado o ponto crítico, a fronteira líquido-gás desaparece: existe um fluido supercrítico e não há ebulição.",
  hint:"Se não há fronteira, o que acontece com a ebulição?"
},
{
  id:"q-dia-3", topic:"diagrama", level:4, type:"mc",
  prompt:"Para o CO₂, a pressão do ponto triplo é maior que 1 atm. A consequência prática disso é que, na pressão atmosférica, o CO₂ sólido:",
  options:["funde antes de evaporar, como a água","sublima, passando direto de sólido para gás","não muda de estado em nenhuma temperatura","só existe acima de 100 °C"],
  answer:1,
  whyWrong:{0:"Isso exigiria que a fase líquida fosse estável a 1 atm, o que não ocorre para o CO₂.",2:"Ele muda de estado normalmente — só não passa pelo líquido.",3:"O gelo-seco sublima bem abaixo da temperatura ambiente."},
  explain:"Se 1 atm está abaixo da pressão do ponto triplo, a fase líquida não é estável nessa pressão: o sólido vai direto para gás.",
  hint:"Sem fase líquida estável, sobra qual caminho?"
},

/* ---------- CAP 4 · EBULIÇÃO ---------- */
{
  id:"m-c4-4", topic:"ebulicao", level:1, type:"vf",
  prompt:"A ebulição ocorre quando a pressão máxima de vapor do líquido se iguala à pressão externa.",
  answer:true,
  explain:"Essa é exatamente a condição de ebulição. Por isso a temperatura de ebulição muda quando a pressão externa muda.",
  hint:"É a definição operacional de ebulição."
},
{
  id:"q-ebu-1", topic:"ebulicao", level:1, type:"mc",
  prompt:"Em uma cidade de grande altitude, a água ferve:",
  options:["acima de 100 °C, porque o ar é mais rarefeito","abaixo de 100 °C, porque a pressão atmosférica é menor","exatamente a 100 °C, pois a temperatura de ebulição é fixa","não ferve, pois falta oxigênio"],
  answer:1,
  whyWrong:{0:"Ar rarefeito significa pressão menor — e pressão menor derruba a temperatura de ebulição.",2:"100 °C vale ao nível do mar, a 1 atm.",3:"A ebulição não depende da presença de oxigênio."},
  explain:"Menor pressão externa → a pressão de vapor iguala a externa em temperatura menor → ferve antes dos 100 °C.",
  hint:"O que a altitude faz com a pressão atmosférica?"
},
{
  id:"q-ebu-2", topic:"ebulicao", level:2, type:"mc",
  prompt:"A panela de pressão cozinha mais rápido porque:",
  options:["a água ferve em temperatura menor, poupando energia","o vapor preso aumenta a pressão interna e eleva a temperatura de ebulição","ela transfere calor por radiação","o alimento absorve o vapor diretamente"],
  answer:1,
  whyWrong:{0:"Se a água fervesse mais fria, o cozimento seria mais lento — é o que acontece na altitude.",2:"O mecanismo dominante é condução e convecção, e não é isso que explica a rapidez.",3:"Absorver vapor não é o que acelera o cozimento."},
  explain:"A válvula segura o vapor, a pressão sobe, a água ferve acima de 100 °C e a temperatura mais alta acelera o cozimento.",
  hint:"Pressão externa maior exige qual temperatura?"
},
{
  id:"q-ebu-3", topic:"ebulicao", level:3, type:"vf",
  prompt:"Aumentar a chama sob uma panela com água fervendo faz a água ficar mais quente que 100 °C (ao nível do mar).",
  answer:false,
  explain:"Durante a ebulição a temperatura fica no patamar. A energia extra só acelera a vaporização; a temperatura não sobe enquanto houver líquido fervendo naquela pressão.",
  hint:"Lembre-se do patamar da curva de aquecimento."
},
{
  id:"q-ebu-4", topic:"ebulicao", level:4, type:"mc",
  prompt:"Um líquido está a 60 °C, com pressão máxima de vapor de 400 mmHg. A pressão externa é de 400 mmHg. Nessas condições, o líquido:",
  options:["está em ebulição","está apenas evaporando lentamente","está congelando","não pode existir como líquido"],
  answer:0,
  whyWrong:{1:"Evaporação lenta é o que ocorre quando a pressão de vapor é *menor* que a externa.",2:"Nada no enunciado indica resfriamento até o congelamento.",3:"A ebulição é justamente o líquido convivendo com seu vapor."},
  explain:"Pressão de vapor igual à pressão externa é exatamente a condição de ebulição — mesmo a 60 °C.",
  hint:"Compare os dois valores de pressão."
},

/* ---------- CAP 4 · PRESSÃO DE VAPOR ---------- */
{
  id:"m-c4-5", topic:"pvapor", level:2, type:"mc",
  prompt:"Em um recipiente fechado, quando o sistema líquido/vapor atinge o equilíbrio:",
  options:["a evaporação para completamente","a condensação para completamente","evaporação e condensação continuam, com a mesma velocidade","o líquido desaparece por completo"],
  answer:2,
  whyWrong:{0:"O equilíbrio é dinâmico: nada para.",1:"A condensação continua acontecendo, na mesma taxa da evaporação.",3:"A quantidade de líquido fica constante justamente porque há equilíbrio."},
  explain:"Equilíbrio dinâmico: os dois processos continuam com velocidades iguais, e a quantidade de vapor deixa de variar.",
  hint:"Equilíbrio é empate, não parada."
},
{
  id:"q-pv-1", topic:"pvapor", level:1, type:"mc",
  prompt:"A pressão máxima de vapor de um líquido puro depende de:",
  options:["temperatura e natureza do líquido","volume do líquido e formato do recipiente","apenas da área da superfície","apenas da pressão atmosférica"],
  answer:0,
  whyWrong:{1:"Volume e recipiente afetam a velocidade do processo, não o valor de equilíbrio.",2:"Área muda a rapidez da evaporação, não a pressão de vapor.",3:"A pressão atmosférica influencia a ebulição, não o valor da pressão de vapor."},
  explain:"Só dois fatores mandam: temperatura e natureza do líquido (intensidade das forças intermoleculares).",
  hint:"Dois fatores, e nenhum deles é quantidade."
},
{
  id:"q-pv-2", topic:"pvapor", level:2, type:"vf",
  prompt:"Evaporação e ebulição são o mesmo fenômeno com nomes diferentes.",
  answer:false,
  explain:"Evaporação é lenta, ocorre só na superfície e em qualquer temperatura. Ebulição é rápida, ocorre em todo o líquido e só quando P.vapor = P.externa.",
  hint:"Onde cada uma acontece dentro do líquido?"
},
{
  id:"q-pv-3", topic:"pvapor", level:3, type:"mc",
  prompt:"Água e álcool etílico estão a 25 °C. O álcool evapora mais rápido porque:",
  options:["tem maior massa molar","suas forças intermoleculares são mais fracas, o que lhe dá maior pressão de vapor","tem temperatura maior que a água","é uma substância iônica"],
  answer:1,
  whyWrong:{0:"Massa molar maior tende a dificultar, não facilitar, a evaporação.",2:"Ambos estão à mesma temperatura, conforme o enunciado.",3:"O álcool etílico é uma substância molecular."},
  explain:"Interações mais fracas → mais moléculas conseguem escapar → maior pressão de vapor → maior volatilidade.",
  hint:"Quem segura menos, deixa escapar mais."
},

/* ---------- CAP 4 · FATORES ---------- */
{
  id:"m-c4-6", topic:"fatores", level:2, type:"vf",
  prompt:"Dobrar a quantidade de líquido em um recipiente fechado dobra a pressão de vapor no equilíbrio.",
  answer:false,
  explain:"A pressão de vapor de equilíbrio não depende da quantidade de líquido nem da área. Depende apenas da temperatura e da natureza do líquido.",
  hint:"Quantidade muda a velocidade, não o valor final."
},
{
  id:"q-fat-1", topic:"fatores", level:2, type:"mc",
  prompt:"Aumentando a área da superfície de um líquido em recipiente fechado, o que acontece?",
  options:["A pressão de vapor de equilíbrio aumenta","A pressão de vapor de equilíbrio diminui","O equilíbrio é atingido mais rápido, mas a pressão de vapor final é a mesma","Nada muda, nem a velocidade"],
  answer:2,
  whyWrong:{0:"Área é fator de velocidade, não de valor de equilíbrio.",1:"Área maior nunca diminui a evaporação.",3:"A velocidade muda, sim — mais superfície, mais moléculas escapando por segundo."},
  explain:"Área maior acelera a evaporação, mas o valor da pressão de vapor no equilíbrio continua o mesmo naquela temperatura.",
  hint:"Separe 'quão rápido' de 'quanto no final'."
},
{
  id:"q-fat-2", topic:"fatores", level:3, type:"order",
  prompt:"Ordene os líquidos do MAIS volátil para o MENOS volátil a 25 °C.",
  items:["Éter etílico","Acetona","Álcool etílico","Água"],
  explain:"A ordem acompanha a intensidade das forças intermoleculares: o éter praticamente não faz ligações de hidrogênio, enquanto a água faz muitas e fortes.",
  hint:"Quanto mais forte a interação, menos volátil."
},
{
  id:"q-fat-3", topic:"fatores", level:4, type:"mc",
  prompt:"Dois frascos fechados contêm água pura a 40 °C: um com 20 mL e outro com 200 mL. Comparando a pressão de vapor no equilíbrio:",
  options:["é 10 vezes maior no frasco de 200 mL","é maior no frasco de 20 mL, pois há mais espaço para vapor","é igual nos dois frascos","depende do formato do frasco"],
  answer:2,
  whyWrong:{0:"Quantidade de líquido não entra no valor da pressão de vapor de equilíbrio.",1:"Mais espaço vazio não altera a pressão de equilíbrio; apenas o tempo até alcançá-la.",3:"Formato influencia área e velocidade, não o valor final."},
  explain:"Mesma substância, mesma temperatura → mesma pressão de vapor de equilíbrio, independentemente do volume.",
  hint:"Só temperatura e natureza contam."
},

/* ---------- CAP 4 · TONOSCOPIA ---------- */
{
  id:"m-c4-7", topic:"tonoscopia", level:2, type:"mc",
  prompt:"Adicionar um soluto NÃO VOLÁTIL à água faz a pressão de vapor da solução:",
  options:["aumentar","diminuir","permanecer igual","zerar"],
  answer:1,
  whyWrong:{0:"O soluto dificulta a saída do solvente — o efeito é de queda.",2:"É justamente o abaixamento que caracteriza a tonoscopia.",3:"O solvente continua evaporando, só que menos."},
  explain:"As partículas do soluto dificultam a passagem do solvente para a fase vapor: P = X·P°, com X < 1.",
  hint:"X do solvente é sempre menor que 1."
},
{
  id:"q-ton-1", topic:"tonoscopia", level:2, type:"fill",
  prompt:"Complete a Lei de Raoult para soluções com soluto não volátil.",
  template:["P", "=", "@", "·", "@"],
  tokens:["X solvente","P°","X soluto","ΔT"],
  answer:["X solvente","P°"],
  explain:"P = X(solvente) · P°. A fração molar é a do SOLVENTE, e P° é a pressão de vapor do solvente puro.",
  hint:"A fração molar que entra é a do solvente."
},
{
  id:"q-ton-2", topic:"tonoscopia", level:3, type:"num",
  prompt:"Um solvente puro tem P° = 120 mmHg. Em uma solução, a fração molar do solvente é 0,75. Qual a pressão de vapor da solução?",
  answer:90, tol:0.5, unit:"mmHg",
  explain:"P = X · P° = 0,75 · 120 = 90 mmHg. O abaixamento foi de 30 mmHg.",
  hint:"Multiplique a fração molar do solvente pela pressão do solvente puro."
},
{
  id:"q-ton-3", topic:"tonoscopia", level:4, type:"mc",
  prompt:"Três soluções aquosas com a mesma quantidade de matéria de soluto: (I) glicose, (II) NaCl, (III) CaCl₂. Qual apresenta a MENOR pressão de vapor?",
  options:["I, a glicose","II, o NaCl","III, o CaCl₂","Todas iguais, pois têm a mesma quantidade em mol"],
  answer:2,
  whyWrong:{0:"A glicose não se dissocia (i = 1): é a que menos abaixa a pressão de vapor.",1:"O NaCl produz 2 partículas, mas o CaCl₂ produz 3.",3:"O que conta é o número de PARTÍCULAS em solução, e não o número de mols de fórmula dissolvidos."},
  explain:"CaCl₂ → Ca²⁺ + 2 Cl⁻ = 3 partículas (i ≈ 3). Mais partículas, maior abaixamento da pressão de vapor.",
  hint:"Conte íons, não fórmulas."
},

/* ---------- CAP 5 · COLIGATIVAS ---------- */
{
  id:"m-c5-1", topic:"coligativas", level:1, type:"mc",
  prompt:"Propriedades coligativas dependem principalmente de:",
  options:["qual é o soluto dissolvido","quantas partículas de soluto estão dissolvidas","a cor da solução","a massa molar do solvente"],
  answer:1,
  whyWrong:{0:"A identidade do soluto importa só na medida em que define quantas partículas ele produz.",2:"Cor não tem relação com propriedades coligativas.",3:"O solvente define as constantes Kb e Kc, mas o efeito coligativo vem do número de partículas."},
  explain:"Coligativo vem de 'coligado', ligado à quantidade: o que conta é o número de partículas dissolvidas.",
  hint:"Quantas, não quais."
},
{
  id:"q-col-1", topic:"coligativas", level:1, type:"match",
  prompt:"Associe cada propriedade coligativa ao efeito que ela descreve.",
  pairs:[["Tonoscopia","Abaixa a pressão de vapor"],["Ebulioscopia","Eleva a temperatura de ebulição"],["Crioscopia","Abaixa a temperatura de congelamento"],["Osmometria","Eleva a pressão osmótica"]],
  explain:"As quatro decorrem do mesmo fato: o soluto não volátil abaixa a pressão de vapor do solvente.",
  hint:"Vapor cai, fervura sobe, gelo desce, osmótica sobe."
},
{
  id:"q-col-2", topic:"coligativas", level:2, type:"mc",
  prompt:"Qual o valor aproximado do fator de Van't Hoff (i) para o CaCl₂ em solução aquosa diluída?",
  options:["1","2","3","4"],
  answer:2,
  whyWrong:{0:"i = 1 vale para solutos que não se dissociam, como glicose e sacarose.",1:"i ≈ 2 é o caso do NaCl, que gera 2 íons.",3:"O CaCl₂ gera 3 íons, não 4."},
  explain:"CaCl₂ → Ca²⁺ + 2 Cl⁻ : uma fórmula gera 3 partículas, logo i ≈ 3.",
  hint:"Conte os íons produzidos por fórmula."
},
{
  id:"q-col-3", topic:"coligativas", level:4, type:"mc",
  prompt:"Soluções aquosas de mesma molalidade: (I) sacarose, (II) KCl, (III) Al₂(SO₄)₃. Ordene da MAIOR para a MENOR temperatura de ebulição.",
  options:["I > II > III","III > II > I","II > III > I","Todas têm a mesma temperatura de ebulição"],
  answer:1,
  whyWrong:{0:"Essa é exatamente a ordem invertida: a sacarose é a que menos eleva a ebulição.",2:"O Al₂(SO₄)₃ gera 5 íons, mais que o KCl, que gera 2.",3:"Mesma molalidade não significa mesmo número de partículas quando há dissociação."},
  explain:"i: sacarose = 1, KCl = 2, Al₂(SO₄)₃ = 5 (2 Al³⁺ + 3 SO₄²⁻). Mais partículas → maior ΔTb.",
  hint:"Calcule o i de cada um antes de comparar."
},

/* ---------- CAP 5 · EBULIOSCOPIA ---------- */
{
  id:"m-c5-2", topic:"ebulioscopia", level:1, type:"vf",
  prompt:"Adicionar um soluto não volátil à água faz sua temperatura de ebulição aumentar.",
  answer:true,
  explain:"O soluto abaixa a pressão de vapor; é preciso mais temperatura para que ela alcance a pressão externa.",
  hint:"Fervura sobe."
},
{
  id:"q-ebs-1", topic:"ebulioscopia", level:2, type:"fill",
  prompt:"Complete a fórmula da ebulioscopia.",
  template:["ΔTb","=","@","·","@","·","@"],
  tokens:["i","Kb","W","R","M"],
  answer:["i","Kb","W"],
  explain:"ΔTb = i · Kb · W, com i = fator de Van't Hoff, Kb = constante ebulioscópica e W = molalidade (mol/kg de solvente).",
  hint:"R e M pertencem à pressão osmótica."
},
{
  id:"q-ebs-2", topic:"ebulioscopia", level:3, type:"num",
  prompt:"Dissolvem-se 2 mol de glicose (i = 1) em 1 kg de água (Kb = 0,52 °C·kg/mol). Qual o valor de ΔTb, em °C?",
  answer:1.04, tol:0.02, unit:"°C",
  explain:"ΔTb = i·Kb·W = 1 · 0,52 · 2 = 1,04 °C. A solução ferve a 101,04 °C ao nível do mar.",
  hint:"W = 2 mol/kg e i = 1 (glicose não se dissocia)."
},
{
  id:"q-ebs-3", topic:"ebulioscopia", level:3, type:"num",
  prompt:"Uma solução com 1 mol de NaCl (i = 2) em 2 kg de água (Kb = 0,52). Qual a temperatura de ebulição da solução, em °C, ao nível do mar?",
  answer:100.52, tol:0.03, unit:"°C",
  explain:"W = 1/2 = 0,5 mol/kg. ΔTb = 2 · 0,52 · 0,5 = 0,52 °C. Tb = 100 + 0,52 = 100,52 °C.",
  hint:"Calcule primeiro a molalidade: mol de soluto ÷ kg de solvente."
},
{
  id:"q-ebs-4", topic:"ebulioscopia", level:4, type:"mc",
  prompt:"Um aluno calculou ΔTb usando molaridade (mol/L de solução) no lugar de molalidade. O erro dele foi:",
  options:["nenhum, as duas são equivalentes","usar uma grandeza que se refere ao volume da solução, e não à massa do solvente","trocar o Kb pelo Kc","esquecer o fator de Van't Hoff"],
  answer:1,
  whyWrong:{0:"Só coincidem em soluções aquosas muito diluídas, e mesmo assim por aproximação.",2:"O enunciado não menciona troca de constantes.",3:"O erro apontado é o da grandeza de concentração, não do i."},
  explain:"Molalidade é mol de soluto por kg de SOLVENTE; molaridade é mol por litro de SOLUÇÃO. A ebulioscopia usa molalidade.",
  hint:"Uma é massa de solvente, a outra é volume de solução."
},

/* ---------- CAP 5 · CRIOSCOPIA ---------- */
{
  id:"m-c5-3", topic:"crioscopia", level:1, type:"mc",
  prompt:"Água com sal congela a:",
  options:["exatamente 0 °C","acima de 0 °C","abaixo de 0 °C","não congela nunca"],
  answer:2,
  whyWrong:{0:"0 °C é o congelamento da água PURA a 1 atm.",1:"O soluto abaixa, e não eleva, a temperatura de congelamento.",3:"Ela congela, só que em temperatura menor."},
  explain:"O soluto atrapalha a organização do cristal: é preciso temperatura menor para congelar.",
  hint:"Gelo desce."
},
{
  id:"q-cri-1", topic:"crioscopia", level:2, type:"vf",
  prompt:"Jogar sal na estrada em países frios ajuda a evitar a formação de gelo.",
  answer:true,
  explain:"O sal abaixa a temperatura de congelamento da água, mantendo-a líquida abaixo de 0 °C — é a crioscopia aplicada.",
  hint:"Efeito crioscópico na prática."
},
{
  id:"q-cri-2", topic:"crioscopia", level:3, type:"num",
  prompt:"0,5 mol de NaCl (i = 2) em 1 kg de água (Kc = 1,86 °C·kg/mol). Qual a temperatura de congelamento da solução, em °C?",
  answer:-1.86, tol:0.05, unit:"°C",
  explain:"ΔTc = 2 · 1,86 · 0,5 = 1,86 °C. Como a crioscopia SUBTRAI: Tc = 0 − 1,86 = −1,86 °C.",
  hint:"Não esqueça o sinal negativo."
},
{
  id:"q-cri-3", topic:"crioscopia", level:3, type:"mc",
  prompt:"Um aluno calculou ΔTc = 3,72 °C e respondeu que a solução congela a +3,72 °C. O erro foi:",
  options:["calcular o ΔTc errado","somar o ΔTc em vez de subtrair","usar o Kb em vez do Kc","usar molalidade em vez de molaridade"],
  answer:1,
  whyWrong:{0:"O valor do ΔTc pode estar correto; o problema está no que ele fez depois.",2:"Não há informação de que a constante usada foi a errada.",3:"Molalidade é justamente a grandeza correta para a crioscopia."},
  explain:"Na crioscopia a temperatura final é Tc = Tc(puro) − ΔTc. O correto seria −3,72 °C.",
  hint:"Ebulição soma; congelamento subtrai."
},
{
  id:"q-cri-4", topic:"crioscopia", level:4, type:"mc",
  prompt:"Por que a mistura de gelo com sal grosso resfria uma garrafa mais rápido que só gelo?",
  options:["porque o sal aquece a mistura por reação química","porque a mistura atinge temperaturas abaixo de 0 °C, aumentando a diferença de temperatura","porque o sal isola termicamente a garrafa","porque o sal impede a fusão do gelo"],
  answer:1,
  whyWrong:{0:"Não há reação exotérmica relevante; a dissolução do NaCl em água é levemente endotérmica.",2:"O sal não funciona como isolante — o contato térmico continua.",3:"O sal favorece a fusão, e não a impede."},
  explain:"O efeito crioscópico permite água líquida bem abaixo de 0 °C. Com o meio mais frio, a troca de energia com a garrafa é mais intensa.",
  hint:"Quanto maior a diferença de temperatura, mais rápida a troca."
},

/* ---------- CAP 5 · OSMOMETRIA ---------- */
{
  id:"m-c5-4", topic:"osmometria", level:2, type:"mc",
  prompt:"Na osmose, o solvente atravessa a membrana semipermeável:",
  options:["do meio mais concentrado para o menos concentrado","do meio menos concentrado para o mais concentrado","nos dois sentidos, sempre em igual quantidade","apenas se houver pressão aplicada"],
  answer:1,
  whyWrong:{0:"Esse seria o sentido da osmose reversa, que exige pressão aplicada.",2:"Há passagem nos dois sentidos, mas o fluxo líquido é para o meio concentrado.",3:"A osmose é espontânea; pressão é necessária apenas para impedi-la ou invertê-la."},
  explain:"O fluxo líquido de solvente vai para o lado com mais partículas dissolvidas, diluindo-o.",
  hint:"O solvente corre para onde tem mais partícula."
},
{
  id:"q-osm-1", topic:"osmometria", level:2, type:"fill",
  prompt:"Complete a fórmula da pressão osmótica.",
  template:["π","=","@","·","@","·","@","·","@"],
  tokens:["i","M","R","T","Kb","W"],
  answer:["i","M","R","T"],
  explain:"π = i·M·R·T, com M em mol/L, R = 0,082 atm·L/(mol·K) e T em kelvin.",
  hint:"Kb e W pertencem à ebulioscopia."
},
{
  id:"q-osm-2", topic:"osmometria", level:3, type:"num",
  prompt:"Solução 0,2 mol/L de glicose (i = 1) a 27 °C. Qual a pressão osmótica, em atm? (R = 0,082)",
  answer:4.92, tol:0.1, unit:"atm",
  explain:"T = 27 + 273 = 300 K. π = 1 · 0,2 · 0,082 · 300 = 4,92 atm.",
  hint:"Converta a temperatura para kelvin antes de tudo."
},
{
  id:"q-osm-3", topic:"osmometria", level:3, type:"vf",
  prompt:"Na fórmula π = i·M·R·T, a temperatura pode ser usada em graus Celsius.",
  answer:false,
  explain:"T precisa estar em kelvin (temperatura absoluta): T(K) = T(°C) + 273. Esse é um dos erros mais cobrados em prova.",
  hint:"R usa kelvin nas suas unidades."
},
{
  id:"q-osm-4", topic:"osmometria", level:5, type:"mc",
  prompt:"Hemácias colocadas em água destilada incham e podem romper. A explicação correta é:",
  options:["a água destilada é hipertônica em relação ao interior da célula","o meio externo é hipotônico, então o solvente entra na célula por osmose","o sal da célula sai por osmose e a célula incha","a membrana da hemácia é impermeável à água"],
  answer:1,
  whyWrong:{0:"Água destilada tem menos partículas dissolvidas: é hipotônica, não hipertônica.",2:"Quem atravessa a membrana semipermeável é o solvente, não o soluto.",3:"Se fosse impermeável à água, nada aconteceria com a célula."},
  explain:"O interior da hemácia é mais concentrado; a água entra rumo ao meio mais concentrado até a célula romper (hemólise).",
  hint:"Para onde o solvente sempre corre?"
},

/* ---------- CAP 6 · TERMODINÂMICA ---------- */
{
  id:"m-c6-1", topic:"termodinamica", level:1, type:"mc",
  prompt:"Um processo em que o sistema ABSORVE energia da vizinhança é chamado de:",
  options:["exotérmico","endotérmico","isotérmico","adiabático"],
  answer:1,
  whyWrong:{0:"Exotérmico é o oposto: o sistema libera energia.",2:"Isotérmico se refere a temperatura constante, não ao sentido do fluxo.",3:"Adiabático significa sem troca de calor com a vizinhança."},
  explain:"ENDO = energia ENTRA no sistema. A vizinhança esfria.",
  hint:"Endo entra, exo exporta."
},
{
  id:"q-ter-1", topic:"termodinamica", level:1, type:"vf",
  prompt:"Calor e temperatura são a mesma grandeza.",
  answer:false,
  explain:"Calor é energia em trânsito por diferença de temperatura (J, cal). Temperatura mede a agitação média das partículas (°C, K).",
  hint:"Um se mede em joules; o outro, em graus."
},
{
  id:"q-ter-2", topic:"termodinamica", level:2, type:"match",
  prompt:"Classifique cada processo.",
  pairs:[["Combustão da gasolina","Exotérmico"],["Fotossíntese","Endotérmico"],["Gelo derretendo","Endotérmico"],["Vapor condensando na janela","Exotérmico"]],
  explain:"Absorveu energia (subiu de estado, formou substância mais energética) = endotérmico. Liberou = exotérmico.",
  hint:"Subiu de estado absorve; desceu libera."
},
{
  id:"q-ter-3", topic:"termodinamica", level:3, type:"mc",
  prompt:"Uma bolsa térmica de farmácia fica gelada ao ser quebrada. Sobre o sistema é correto dizer que:",
  options:["é exotérmico, pois libera frio","é endotérmico, pois absorve energia da vizinhança","é isotérmico, pois a temperatura não muda","não há troca de energia envolvida"],
  answer:1,
  whyWrong:{0:"Frio não é liberado; o que existe é energia sendo absorvida.",2:"A temperatura muda claramente — a bolsa esfria.",3:"Há troca de energia: é justamente ela que esfria a bolsa."},
  explain:"A dissolução do sal absorve energia do ambiente (endotérmica), e por isso a bolsa e o que está ao redor esfriam.",
  hint:"Se esfriou a vizinhança, quem ficou com a energia?"
},

/* ---------- CAP 6 · CURVA ---------- */
{
  id:"m-c6-2", topic:"termodinamica", level:2, type:"mc",
  prompt:"Durante a fusão de uma substância pura, a temperatura:",
  options:["aumenta continuamente","permanece constante","diminui","oscila aleatoriamente"],
  answer:1,
  whyWrong:{0:"A temperatura só volta a subir depois que toda a substância fundir.",2:"Está sendo fornecida energia — não há motivo para a temperatura cair.",3:"O comportamento é bem definido: patamar."},
  explain:"A energia fornecida é usada para vencer as interações entre as partículas, não para aumentar a agitação média.",
  hint:"É o famoso patamar do gráfico."
},
{
  id:"q-cur-1", topic:"termodinamica", level:2, type:"mc",
  prompt:"Em um gráfico de temperatura × energia fornecida, um TRECHO INCLINADO indica:",
  options:["mudança de estado em andamento","aquecimento de uma única fase","que a substância é impura","que o sistema perdeu energia"],
  answer:1,
  whyWrong:{0:"Mudança de estado aparece como patamar horizontal.",2:"Pureza se avalia pelo formato dos patamares, não pela inclinação.",3:"Se a temperatura sobe, energia está entrando."},
  explain:"Trecho inclinado: a energia aumenta a agitação das partículas e a temperatura sobe, sem mudança de fase.",
  hint:"Rampa = temperatura mudando."
},
{
  id:"q-cur-2", topic:"termodinamica", level:3, type:"vf",
  prompt:"Uma mistura comum costuma apresentar mudança de estado em uma faixa de temperatura, e não em um patamar bem definido.",
  answer:true,
  explain:"Substâncias puras mudam de estado em temperatura constante; misturas comuns, em faixa. É assim que gráficos de prova revelam pureza.",
  hint:"Patamar bem definido é assinatura de substância pura."
},
{
  id:"q-cur-3", topic:"termodinamica", level:4, type:"order",
  prompt:"Ordene os trechos da curva de aquecimento da água, de −20 °C até 120 °C.",
  items:["Aquecimento do gelo (−20 a 0 °C)","Patamar de fusão (0 °C)","Aquecimento da água líquida (0 a 100 °C)","Patamar de ebulição (100 °C)","Aquecimento do vapor (100 a 120 °C)"],
  explain:"Rampa, patamar, rampa, patamar, rampa: a energia alterna entre aquecer uma fase e mudar de fase.",
  hint:"Sempre alternando rampa e patamar."
},

/* ---------- CAP 6 · ENTALPIA ---------- */
{
  id:"m-c6-3", topic:"entalpia", level:1, type:"mc",
  prompt:"Uma reação com ΔH = −250 kJ/mol é:",
  options:["endotérmica, absorve energia","exotérmica, libera energia","isotérmica","impossível de classificar sem mais dados"],
  answer:1,
  whyWrong:{0:"Endotérmica teria ΔH positivo.",2:"O sinal do ΔH classifica o processo diretamente.",3:"O sinal do ΔH é suficiente para classificar."},
  explain:"ΔH < 0: os produtos têm menor entalpia que os reagentes, então energia saiu do sistema.",
  hint:"EXO exporta → ΔH negativo."
},
{
  id:"q-ent-1", topic:"entalpia", level:2, type:"fill",
  prompt:"Complete a definição de variação de entalpia.",
  template:["ΔH","=","@","−","@"],
  tokens:["H produtos","H reagentes","T final","Kc"],
  answer:["H produtos","H reagentes"],
  explain:"ΔH = H(produtos) − H(reagentes). A ordem importa: inverter troca o sinal e a classificação.",
  hint:"O que chega depois na reação vem primeiro na conta."
},
{
  id:"q-ent-2", topic:"entalpia", level:3, type:"num",
  prompt:"Em uma reação, H(reagentes) = 400 kJ e H(produtos) = 150 kJ. Qual o valor de ΔH, em kJ?",
  answer:-250, tol:1, unit:"kJ",
  explain:"ΔH = 150 − 400 = −250 kJ. Valor negativo → reação exotérmica.",
  hint:"Produtos menos reagentes — cuidado com o sinal."
},
{
  id:"q-ent-3", topic:"entalpia", level:3, type:"mc",
  prompt:"Em um diagrama de entalpia, uma reação ENDOTÉRMICA aparece como:",
  options:["produtos em nível mais baixo que reagentes","produtos em nível mais alto que reagentes","produtos e reagentes no mesmo nível","uma linha vertical"],
  answer:1,
  whyWrong:{0:"Esse é o desenho de uma reação exotérmica.",2:"Isso indicaria ΔH = 0, sem troca líquida de energia.",3:"O diagrama compara níveis de energia, não é uma linha vertical."},
  explain:"Endotérmica absorve energia: os produtos ficam mais energéticos, o gráfico sobe e ΔH > 0.",
  hint:"Endo sobe, exo desce."
},
{
  id:"q-ent-4", topic:"entalpia", level:5, type:"mc",
  prompt:"A combustão do metano tem ΔH = −890 kJ/mol. Um aluno concluiu que 'a reação libera pouca energia porque o valor é negativo'. A avaliação correta é:",
  options:["ele está certo: valores negativos indicam pouca energia","ele está errado: o sinal indica o sentido do fluxo, e o módulo (890) indica muita energia liberada","ele está certo, mas por outro motivo","o ΔH negativo é impossível para combustão"],
  answer:1,
  whyWrong:{0:"Sinal e intensidade são informações independentes.",2:"A conclusão dele é incorreta, não apenas mal justificada.",3:"Combustões são tipicamente exotérmicas, com ΔH negativo."},
  explain:"O sinal diz de onde a energia saiu ou para onde foi; o módulo diz quanto. 890 kJ/mol é uma quantidade grande de energia liberada.",
  hint:"Separe sinal (sentido) de módulo (quantidade)."
},

/* ---------- CAP 6 · FASES E ENERGIA ---------- */
{
  id:"m-c6-4", topic:"entalpia", level:2, type:"mc",
  prompt:"Qual o sinal do ΔH da vaporização da água?",
  options:["negativo, pois libera energia","positivo, pois absorve energia","zero, pois é fenômeno físico","depende da pressão externa apenas"],
  answer:1,
  whyWrong:{0:"Liberar energia é a condensação, o caminho inverso.",2:"Fenômenos físicos também têm variação de entalpia.",3:"A pressão altera a temperatura de ebulição, mas não o sinal do ΔH da vaporização."},
  explain:"Vaporizar exige separar as moléculas: o sistema absorve energia, então ΔH > 0.",
  hint:"Subiu de estado → ΔH positivo."
},
{
  id:"q-fen-1", topic:"entalpia", level:2, type:"match",
  prompt:"Associe cada mudança de fase ao sinal do seu ΔH.",
  pairs:[["Fusão","ΔH > 0"],["Condensação","ΔH < 0"],["Sublimação","ΔH > 0"],["Solidificação","ΔH < 0"]],
  explain:"Afastar partículas custa energia (ΔH > 0); aproximá-las libera energia (ΔH < 0).",
  hint:"Subiu absorve, desceu libera."
},
{
  id:"q-fen-2", topic:"entalpia", level:4, type:"mc",
  prompt:"Uma queimadura por vapor a 100 °C é mais grave que por água líquida a 100 °C porque:",
  options:["o vapor está mais quente que a água","o vapor libera a energia de condensação ao tocar a pele","o vapor é quimicamente diferente da água","o vapor conduz eletricidade"],
  answer:1,
  whyWrong:{0:"Ambos estão a 100 °C, conforme o enunciado.",2:"Vapor e água líquida são a mesma substância.",3:"Condutividade elétrica não tem relação com a gravidade da queimadura."},
  explain:"Ao condensar na pele, o vapor libera a entalpia de condensação (cerca de 40,7 kJ/mol para a água), além da energia liberada ao esfriar.",
  hint:"O que o vapor precisa fazer antes de esfriar?"
},
{
  id:"q-fen-3", topic:"entalpia", level:5, type:"mc",
  prompt:"Para a água, ΔH de vaporização ≈ 40,7 kJ/mol e ΔH de fusão ≈ 6,0 kJ/mol. A explicação para essa diferença é:",
  options:["a fusão ocorre em temperatura menor, então gasta menos energia","separar completamente as moléculas na vaporização exige romper muito mais interações que apenas soltá-las do cristal","a vaporização envolve reação química e a fusão não","o valor maior é apenas convenção de unidade"],
  answer:1,
  whyWrong:{0:"A temperatura em que ocorre não determina o custo energético da transformação.",2:"Ambas são transformações físicas.",3:"Os dois valores estão na mesma unidade, kJ/mol."},
  explain:"Na fusão, as moléculas continuam próximas e interagindo. Na vaporização, elas precisam se separar quase completamente — o que custa muito mais energia.",
  hint:"Compare o quanto as moléculas se afastam em cada caso."
},

/* ---------- MISTAS / DESAFIO MESTRE ---------- */
{
  id:"q-mix-1", topic:"coligativas", level:5, type:"mc",
  prompt:"Em uma cidade de altitude elevada, um cozinheiro adiciona bastante sal à água do macarrão. Sobre a temperatura de ebulição dessa solução, é correto afirmar:",
  options:["será exatamente 100 °C, pois o sal compensa a altitude","será menor que 100 °C se o efeito da altitude superar o efeito do sal","será obrigatoriamente maior que 100 °C por causa do sal","não é possível ferver água em altitude elevada"],
  answer:1,
  whyWrong:{0:"Não há razão para os dois efeitos se cancelarem exatamente.",2:"O sal eleva a temperatura em relação à água pura *naquela altitude*, mas a altitude já a derrubou bastante.",3:"A água ferve normalmente em altitude — só que em temperatura menor."},
  explain:"Dois efeitos opostos: a altitude reduz a pressão externa (derruba Tb) e o sal eleva Tb. O resultado depende da intensidade de cada um — nas quantidades de cozinha, a altitude domina.",
  hint:"Some os dois efeitos, um para baixo e outro para cima."
},
{
  id:"q-mix-2", topic:"coligativas", level:5, type:"mc",
  prompt:"Duas soluções aquosas têm a MESMA temperatura de congelamento. É possível afirmar que elas:",
  options:["têm o mesmo soluto","têm a mesma quantidade efetiva de partículas dissolvidas (i·W igual)","têm a mesma massa de soluto","têm a mesma densidade"],
  answer:1,
  whyWrong:{0:"Solutos diferentes podem produzir o mesmo efeito coligativo.",2:"Massas iguais de solutos diferentes correspondem a números de partículas diferentes.",3:"Densidade não é propriedade coligativa."},
  explain:"O efeito crioscópico depende de i·Kc·W. Com o mesmo solvente (mesmo Kc) e o mesmo ΔTc, o produto i·W tem de ser igual.",
  hint:"O que a fórmula da crioscopia realmente compara?"
},
{
  id:"q-mix-3", topic:"pvapor", level:5, type:"order",
  prompt:"Ordene a cadeia causal que explica por que uma solução salgada ferve acima de 100 °C.",
  items:["Soluto não volátil é dissolvido na água","A pressão de vapor da solução fica menor que a da água pura","É preciso mais temperatura para a pressão de vapor igualar a pressão externa","A temperatura de ebulição da solução aumenta"],
  explain:"Toda a ebulioscopia é uma consequência da tonoscopia: primeiro cai a pressão de vapor, depois sobe a temperatura de ebulição.",
  hint:"Comece pelo soluto e termine no termômetro."
},
{
  id:"q-mix-4", topic:"diagrama", level:5, type:"mc",
  prompt:"Uma substância sólida é aquecida sob pressão CONSTANTE e menor que a do seu ponto triplo. O que se observa?",
  options:["fusão seguida de vaporização","sublimação direta de sólido para gás","condensação","solidificação"],
  answer:1,
  whyWrong:{0:"Abaixo da pressão do ponto triplo a fase líquida não é estável.",2:"Condensação é gás → líquido, o caminho contrário do aquecimento.",3:"A substância já está sólida e está sendo aquecida."},
  explain:"Abaixo da pressão do ponto triplo, a linha atravessada é a de sublimação: o sólido passa direto para gás.",
  hint:"Desenhe uma linha horizontal abaixo do ponto triplo no diagrama."
},
{
  id:"q-mix-5", topic:"entalpia", level:5, type:"mc",
  prompt:"O suor resfria o corpo humano. A explicação termodinâmica correta é:",
  options:["o suor é mais frio que a pele e absorve calor por contato","a evaporação do suor é endotérmica e retira energia da pele","o suor forma uma camada isolante","a condensação do suor libera energia para o ambiente"],
  answer:1,
  whyWrong:{0:"O suor sai praticamente na temperatura do corpo.",2:"Uma camada isolante dificultaria a perda de energia, aquecendo ainda mais.",3:"O que ocorre é evaporação, não condensação."},
  explain:"Vaporização é endotérmica: para evaporar, o suor absorve energia da pele, que esfria.",
  hint:"Qual mudança de estado o suor sofre?"
}
];

/* índice rápido por id */
const QUESTION_MAP = QUESTIONS.reduce((m,q)=>{ m[q.id]=q; return m; },{});
