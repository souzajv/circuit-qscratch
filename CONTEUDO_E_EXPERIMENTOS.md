# Conteúdo e experimentos do Circuit QScratch

Atualizado em 09/11/2026. A plataforma usa uma versão introdutória comum, principalmente para adolescentes sem conhecimento prévio. Escolaridade caracteriza a pesquisa e não altera o ensino. As 29 páginas permanecem divididas em cinco blocos.

## Como o aprendizado acontece

Cada bloco apresenta explicações com exemplos, três perguntas com uma confirmação cada, uma previsão prática sem pontos, a montagem ou medição e uma conclusão explicada. O estudante pode errar no quiz e seguir após a correção. Antes da bancada, precisa conferir corretamente a previsão, com explicação e novas tentativas sem desconto.

Esse reforço busca relacionar a ação à função da peça. Não é um teste validado de domínio. Os pontos continuam sendo calculados pelos erros do quiz e pela primeira dica, com piso 2, crédito após a ação prática e melhora da melhor nota ao refazer.

## Mapa do percurso

| Bloco | Páginas | Ideias e exemplos | Quiz e previsão prática | Ação e conclusão |
|---|---|---|---|---|
| Conheça os qubits | 6 | Propósito do circuito, bit e interruptor; qubit, estado e preparação; duas linhas; símbolos e ordem do par; sequência de operações | Contar qubits, ler 00 e reconhecer a direção. Na previsão, ler 01 quando a linha de cima começa em 0 e a de baixo em 1 | Encaixar dois qubits preparados em 0. Explicar por que o começo é 00 |
| Observe uma medição | 5 | Um resultado por rodada; preparar 0 ou 1; repetir o preparo; medição e estado; previsão e observação | Relacionar preparo e resultado e explicar as rodadas. Na previsão, reconhecer o resultado 1 de um preparo em 1 | Ativar o medidor do treino preparado em 0. Explicar que o circuito principal não foi alterado |
| Experimente a porta H | 6 | Porta como operação; H em 0; chances e contagens; limite da moeda; H duas vezes sem medir entre elas; H apenas em cima | Reconhecer 0 ou 1, variação das contagens e efeito de duas H. Na previsão, indicar 00 e 10 com H só em cima | Encaixar H na primeira linha. Explicar a mudança de possibilidades e a segunda linha mantida em 0 |
| Conecte com CNOT | 6 | Controle e alvo; quatro entradas; ponto e círculo; atuação na superposição; ordem das portas; preparo conjunto | Aplicar CNOT em 10 e 11 e comparar a ordem das portas. Na previsão, indicar 11 → 10 | Encaixar CNOT após H. Explicar a transformação de 00/10 em 00/11 sem medir o controle |
| Descubra o estado de Bell | 6 | Circuito completo; papel da CNOT; correlação; cartões clássicos e limite da evidência; rodadas; recapitulação | Identificar os pares, aceitar repetições e distinguir correlação de prova isolada. Na previsão, comparar com a ausência da CNOT | Medir Bell uma vez, sem exigir os dois resultados. Retomar a função de cada peça e indicar próximo estudo |

## Textos, símbolos e analogias

A primeira fala situa a computação quântica e o simulador. Estado e preparação recebem explicação cotidiana. Antes de depender de |0⟩, |1⟩ e |00⟩, a fala relaciona os símbolos aos preparos e às linhas. Emaranhamento recebe uma apresentação como estado conjunto, preservando a ressalva de que um gráfico de resultados iguais sozinho não o prova.

O interruptor representa informação clássica. A moeda explica chances iguais e tem seu limite apresentado. A mesma página que pede comparar uma e duas H oferece as duas opções. Não apresentar superposição como valor clássico escondido, resultado duplo na tela ou garantia de alternância.

## Organização dos exemplos

Os laboratórios extensos separam Preparar, Experimentar e Resultados. A fala indica essas abas pelos nomes. Após medir, Ver resultados abre a aba e leva o foco para ela. As chances previstas e as contagens observadas aparecem separadas.

Antes da apresentação de H, os rótulos são Preparar em 0, Preparar em 1 e Superposição com chances iguais em todas as abas. O laboratório de medição desenha só o qubit de treino. O exemplo da CNOT se chama Mude os valores de entrada; os papéis de controle e alvo permanecem fixos.

Trocar o preparo reinicia as amostras conforme aviso. Selecionar o mesmo preparo não limpa nada. Trocar abas, avançar e voltar a uma explicação ou rever as falas a partir do quiz preserva os exemplos durante a sessão do bloco. Ao sair do bloco ou recarregar, esses laboratórios recomeçam; suas amostras não são prometidas como salvas na conta.

No desktop os exemplos ficam ao lado; nas telas menores, abaixo. As referências de posição na fala acompanham o layout. Conteúdo oculto não recebe foco nem ocupa espaço. Movimento reduzido mantém textos, números e ações disponíveis.

## Prática e retorno

A previsão oferece uma pequena variação do conceito, com explicação e novas tentativas sem pontos. Os encaixes e o medidor ficam indisponíveis até sua conferência correta. O checkpoint da conta guarda sua escolha e confirmação, junto à tentativa já existente. Blocos concluídos não são invalidados por essa adição.

Hover e foco destacam o medidor. Clique, Enter ou Espaço realizam a medição. Uma rodada mostra um resultado; repetir a ativação não sorteia novamente. Preparar outra rodada reinicia o experimento sem creditar pontos de novo.

No quiz, o retorno de erro usa a correção própria da pergunta, sem frases de comemoração do acerto. O aluno pode rever a explicação mantendo a resposta encerrada e os descontos.

## Revisões e compatibilidade

Novas tentativas usam CONTENT_REVISION 3. Há cinco respostas corretas em cada uma das três posições no conjunto de 15 itens, com ordem fixa e alternativas plausíveis. Checkpoints CONTENT_REVISION 2 mantêm suas perguntas e posições anteriores até o fim daquela tentativa. Assim, uma escolha salva não muda de significado. Notas e conclusões anteriores não são recalculadas.

A escolaridade não seleciona o texto advanced. Esses textos e as perguntas originais da revisão 2 permanecem no código para referência e compatibilidade. A versão de conteúdo é diferente de SURVEY_VERSION, que continua 3. O instrumento de pesquisa não foi alterado nesta correção. Ver [Questionários](QUESTIONARIOS_PESQUISA.md).

## Fontes e limites

- [IBM, Quantum mechanics basics](https://quantum.cloud.ibm.com/learning/en/courses/use-a-qc-today/quantum-mechanics-basics): qubits, portas e preparo de Bell.
- [IES, Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/20072004.pdf): integração entre explicações e representações e perguntas de recuperação.
- [W3C, On Focus](https://www.w3.org/WAI/WCAG22/Understanding/on-focus.html): navegação pelo foco sem mudança automática de contexto.
- Materiais originais do workspace e decisões de ensino permanecem preservados.

As fontes orientam as escolhas. Elas não comprovam a eficácia deste produto. Testes de regras, cálculos e interface não substituem a avaliação com adolescentes ou a revisão docente. As correções não produzem novos resultados para o artigo nem alteram as entregas acadêmicas existentes.
