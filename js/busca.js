// ---------------------------------------------------------------
    //Funções para a buscar no Grafo

    /** OBSERVAÇÕES IMPORTANTES 
     *  
     *   As funções Graph.forEachNode(), Graph.forEachLink(), Graph.forEachLinkedNode()
     * funcionam como se fossem um for. Elas retornam uma variavel em cada iteração. 
     *   Por exemplo, o Graph.forEachNode(function(node){
     *          //Faz um "for" e me retorna os dados do primeiro vértice
     *          //Depois ele passa para o próximo vértice e me retorna o valor 
     *          //Então adicionando um 
     *          console.log("Vértice: " + node.id); 
     *          //Eu consigo ver no console todos os vértices do grafo 
     *   });
     * 
     */
    
    //Variaveis globais 

    //Iterador global do vetor Links
    var ContLinks = 0; 
    //Vetor para armazenar cada passagem dos algoritmos
    var Links = [];
    //Vetor para contar quantas arestas chegam em cada vértice do grafo 
    var vetorOrdenacaoTopologica = [];

    //Essa função é chamada quando qualquer um dos 4 algoritmos de busca são clicados
    function InicialBusca(tipoBusca){
        var numeroVertices = contador;
        switch(tipoBusca){
            case 1:{            //listando os vértices no modal da busca em profundidade
                $('#listaIniciaProfundidade').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaProfundidade').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; }
            case 2:{            //Listando os vértices no modal da busca em largura 
                $('#listaIniciaLargura').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaLargura').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; }
            case 3:{            //Listando os vértices no modal do algoritmo Dijkstra
                if(numeroVertices != 0){
                    $('#aviso').empty(); 
                    $('#listaIniciaDijkstra').empty(); 
                    Graph.forEachNode(function(node){
                        $('#listaIniciaDijkstra').append('<option value=' + node.id + '> ' + node.id +' </option>');
                    });
                }else{
                    $('#aviso').empty(); 
                    $("#aviso").append('<div class="alert alert-warning" role="alert"> Não existe grafo! </div>');
                }
                break; }
            case 4:{            //Listando os vértices que possuem 0 arestas chegando neles, no modal da Ordenação Topológica
                LimparOrdenacao();  
                if(numeroVertices != 0){
                    var ciclagem = true; 
                    if(Direcional()){
                        //Aqui será marcado o quanto de arestas que chegam em cada vértice                         
                        MarcandoArestasDosVertices(); 

                        //Limpando dados anteriores
                        $('#listaIniciaOrdenacao').empty();   
                        $('#vetorVerticesOrdenacaoInfo').empty(); 
                        $('#vetorOrdenacaoInfo').empty();                       

                        //Listando o numero de arestas que chegam em cada vértice 
                        for(var i=0; i<contador;  i++){
                            if(i == 0 )
                                $('#vetorVerticesOrdenacaoInfo').append('<th> Vértice: </th>')
                            $('#vetorVerticesOrdenacaoInfo').append('<th>'+ i + '</th>')
                        }
                        for(var i=0; i<vetorOrdenacaoTopologica.length; i++){
                            if(i == 0){
                                $('#vetorOrdenacaoInfo').append('<th> |A| que chegam: </th>');
                            }
                            $('#vetorOrdenacaoInfo').append('<td> ' + vetorOrdenacaoTopologica[i] +' </td>')
                            if(vetorOrdenacaoTopologica[i] == 0){
                                ciclagem = false; 
                                $('#listaIniciaOrdenacao').append('<option value=' + i + '> ' + i +' </option>');
                            }    
                        }
                        //Se todos os vértices possuirem mais que 0 arestas chegando neles
                        //O algoritmo não continua
                        if(ciclagem == true){
                            $("#aviso_ordenacao").append('<div class="alert alert-danger" role="alert"> O grafo cicla! Não é possível realizar a ordenação topologica </div>');
                        }                                
                    }else {                        
                        $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> O grafo precisa ser direcional! </div>');
                    }
                }else {                    
                    $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> Não existe grafo! </div>');
                }
                break; 
            }
        }
    }

    /*********************************************
     *          ALGORITMOS DE BUSCA 
     *********************************************/

    //Funções para a busca em profundidade
    function BuscaEmProfundidade(){
        //Entra nessa função quando o botão Iniciar for apertado na busca em profundidade
        Limpar(); 

        //Lê qual foi o vértice selecionado para começar a busca
        var verticeInicial = $('#listaIniciaProfundidade').val(); 
        var vetorMarcacao = [];     //Cria um vetor para marcar qual vértice já foi visitado
        ContLinks = 0;              //Zerando variavel global, iterador do vetor Links
        Links = [];                 //Vetor Links, que grava a origem e destino de certa passagem do tipo de busca

        //Zerando o vetor marcacao (|v|) vezes 
        for(var i=0; i<contador; i++){
            vetorMarcacao[i] = 0;
        }
        //Realizar a varredura dos vértices recursivamente
        RecursaoProfundidade(verticeInicial,vetorMarcacao); 

        //Apresenta o resultado na tela da busca em profundidade
        ResultadoNaTela(Links, 'Profundidade',0);
    }

    function RecursaoProfundidade(vertice, vetor){

        //Marcando o vértice atual
        vetor[vertice] = 1; 

        Graph.forEachLinkedNode(vertice , function(VerticeConectado,aresta){
            //Só executa o conteúdo do if se o vértice linkado não estiver marcado
            if(vetor[VerticeConectado.id] == 0){
                //Se não for direcional ele executa normalmente
                //Se for direcional ele só entra se o vértice atual for a origem do link
                if(Direcional() == false || (Direcional() == true && (aresta.fromId == vertice))){ 
                    //Salva a passagem do vértice atual para o próximo vértice
                    Links[ContLinks] = {
                        "fromId": vertice, 
                        "toId":VerticeConectado.id
                    }; 
                    ContLinks++; //Incrementa no iterador do vetor Links
                    
                    //Chama a função novamente com o vértice destino como vértice inicial 
                    RecursaoProfundidade(VerticeConectado.id.toString(),vetor,contador);
                }
            }
        });
    }

    //Funções para a busca em largura
    function BuscaEmLargura(){ 

        //Inicia as variaveis necessarias
        var verticeInicial = $('#listaIniciaLargura').val();    //Le o vértice inicial 
        var vetorMarcacao = [];                                 //Zera vetor marcacao 
        var vetorDist = [];                                     //Zera vetor Distancia
        var fila = new Queue();                                 //Cria uma fila
        ContLinks = 0;                                          //Zera o iterado do vetor Links
        Links = [];                                             //Zera vetor Links
        
        //Limpa os dados no resultado da busca em largura
        Limpar();

        //Zerando o vetor |v| vezes
        for(var i=0; i<contador; i++){
            vetorDist[i] = Infinity;
            vetorMarcacao[i] = 0; 
        }

        //Marca a distancia para o vertice atual (como é o vertice inicial, então a distancia é 0)
        vetorDist[verticeInicial] = 0; 
        //Chama a função recursivamente
        RecursaoLargura(verticeInicial, vetorMarcacao, vetorDist, fila);

        //Apresenta os resultados na tela
        ResultadoNaTela(Links, 'Largura', vetorDist);
    }

    function RecursaoLargura(vertice, vetorMarcacao, vetorDist,fila){
        
        vetorMarcacao[vertice] = 1; //Marcando o vértice atual 
        Graph.forEachLinkedNode(vertice, function(verticeLinkado, aresta){
            if(vetorMarcacao[verticeLinkado.id] == 0){
                //Se não for direcional ele executa normalmente
                //Se for direcional ele só entra se o vértice atual for a origem do link
                if(Direcional() == false || (Direcional() == true && (aresta.fromId == vertice))){
                    //Marcando o caminho dos vértices
                    Links[ContLinks] = {
                        "fromId": vertice,
                        "toId": verticeLinkado.id
                    };
                    ContLinks++; 
                    //Cálculo da distancia
                    //Se a nova distancia calculada de qualquer vértice linkado, for menor que a distancia 
                    //anterior, então troca a distancia
                    nova_distancia = vetorDist[vertice] + aresta.data;               
                    if(nova_distancia < vetorDist[verticeLinkado.id])
                        vetorDist[verticeLinkado.id] = nova_distancia;    

                    //Marca que o vértice já foi adicionado na fila e então adiciona na fila
                    vetorMarcacao[verticeLinkado.id] = 1; 
                    fila.enqueue(verticeLinkado.id.toString());
                }
            }        
        });

        //Depois de terminado de verificar todos os vértices vizinhos do vértice atual 
        //Retira um vértice da fila  e caso a fila não esteja vazia, chama recursivamente
        //para o próximo vértice
        var auxiliar = fila.dequeue();

        if(auxiliar != undefined){
            RecursaoLargura(auxiliar,vetorMarcacao,vetorDist,fila);
        }
    }

    //Funções para Dijkstra
    function Dijkstra(){
        //Lê o vértice inicial 
        var verticeInicial = $('#listaIniciaDijkstra').val(),
            lista = new List(contador),     //Cria uma lista (encadeada) de prioridades com |v| de tamanho
            vetorMarcacao = [],             //Limpa o vetor marcacao 
            vetorDistancia = [];            //Limpa a distancia

        //Zerando 
        Links = [];
        ContLinks = 0; 

        LimparDijkstra(); 

        //Preenchendo os vetores auxiliares 
        for(var i=0; i<contador; i++){
            vetorMarcacao[i] = 0; 
            vetorDistancia[i] = Infinity; 
        }

        //Adicionando os elementos na lista 
        Graph.forEachNode(function(node){
            lista.Add(node.id); 
        });       
        //Todos os vértices são adicionados na lista 

        //Zerando a primeira distancia
        vetorDistancia[verticeInicial] = 0; 
        //Entra na função recursivamente com o vértice selecionado sendo o V0
        RecursaoDijkstra(verticeInicial.toString(), vetorMarcacao, vetorDistancia, lista);

        //Apresenta os resultados na tela
        ResultadoDijkstra(Links, vetorDistancia); 
    }

    function RecursaoDijkstra(vertice, Marcacao, dist, lista){

        //Marca que o vértice atual já foi visitado
        Marcacao[vertice] = 1; 

        //Cria um objeto para verificar qual o menor caminho que o Dijkstra deve seguir
        var menorDist = {
            'toId': null, 
            'peso': Infinity
        }; 

        if(lista.Count() !== 0){        //Verifica se a lista não está vazia
            lista.RemoveAt(vertice);    //Retira o vertice atual da lista

            Graph.forEachLinkedNode(vertice,function(linkedNode,aresta){
                //Entra no if se o grafo não for direcional ou se 
                //O grafo for direcional e o vertice atual for a origem do link 
                if(Direcional() == false || (Direcional() == true && aresta.fromId == vertice)){
                    //Calcula a distancia de todos os vértices linkados 
                    //Mesmo os vértices que já foram marcados como visitados
                    nova_distancia = dist[vertice] + aresta.data;               
                    if(nova_distancia < dist[linkedNode.id])
                        dist[linkedNode.id] = nova_distancia;
                        
                    //Porém só marca como possibilidade de visita o menor caminho
                    //dos vértices ainda não visitado 
                    if(Marcacao[linkedNode.id] == 0){   //Só entra se o linkedNode não tiver sido marcado 
                        if(aresta.data < menorDist.peso){   //Anota o menor caminho encontrado até o momento
                            menorDist.toId = linkedNode.id; 
                            menorDist.peso = aresta.data;
                        }
                    }                    
                }
            });

            //Se houve um caminho marcado para seguir 
            if(menorDist.toId != null){
                //Armazena a passagem no vetor Links
                Links[ContLinks] = {
                    'fromId': vertice, 
                    'toId': menorDist.toId.toString(),
                    'peso': menorDist.peso
                }
                ContLinks++; 
                //E chama recursivamente a função com o próximo vértice 
                RecursaoDijkstra(menorDist.toId.toString(), Marcacao,dist,lista);   
            }
                
        }       
    }

    //Funções para Ordenação topologica
    function OrdenacaoTopologica(){
        if(Direcional()){
            //Só executa se o grafo for direcional 
            //Lê o valor selecionado 
            var verticeInicial = $('#listaIniciaOrdenacao').val(), 
                vetorMarcacao = []; //Zera marcacao 

                //Zera 
                Links = []; 
                ContLinks = 0; 

                //Coloca 0 no vetor marcação |v| vezes
                for(var i=0; i<contador; i++){
                    vetorMarcacao[i] = 0; 
                }

                //Conta quantas arestas chegam em cada vértice 
                MarcandoArestasDosVertices(); 

                //Marca a primeira passagem 
                //Sendo 'ponta' a forma de expressar que um vértice com 0 
                //arestas chegando nele foi selecionado
                Links[ContLinks] = {
                    'fromId': 'ponta', 
                    'toId': verticeInicial
                };
                ContLinks++; 
                //Executa a primeira vez
                RecursaoOrdenacao(verticeInicial,vetorMarcacao);

                //Esse for verifica se teve vértices com 0 arestas chegando nele 
                //que não foram visitados, e se eles não foram visitados, começa a 
                //rodar o algoritmo novamente por aquele vértice (sem zerar os vetores)
                for(var i=0; i<contador; i++){
                    if(vetorMarcacao[i] == 0){
                        if(vetorOrdenacaoTopologica[i] == 0){
                            Links[ContLinks] = {
                                'fromId': 'ponta', 
                                'toId': i
                            };
                            ContLinks++; 
                            RecursaoOrdenacao(i,vetorMarcacao);
                        }
                    }
                }                

                //Mostra o resultado na tela 
                ResultadoNaTelaOrdenacao(); 

        }else {
            //Motra um aviso dizendo que o grafo não é direcional 
            $('#aviso_ordenacao_comeco').empty(); 
            $('#aviso_ordenacao_comeco').append('<div class="alert alert-warning" role="alert"> Não é possível começar a Ordenação! </div>');
        }
    }

    function RecursaoOrdenacao(vertice, vetorMarcacao){

        //Marcando o vértice atual 
        vetorMarcacao[vertice] = 1; 

        //Decrementa um de cada vértice destino do vértice atual no vetor VetorOrdenacaoTopologica 
        Graph.forEachLinkedNode(vertice.toString(), function(linkedNode, aresta){
            if(aresta.toId == linkedNode.id){
                vetorOrdenacaoTopologica[linkedNode.id]--; 
            }
        });

        //Depois de decrementado, entra no próximo vértice que tiver 0 arestas chegando nele 
        //E ainda não foi visitado
        Graph.forEachLinkedNode(vertice.toString(), function(linkedNode, aresta){
            if(vetorOrdenacaoTopologica[linkedNode.id] == 0 && vetorMarcacao[linkedNode.id] == 0){
                Links[ContLinks] = {
                    'fromId': vertice, 
                    'toId': linkedNode.id
                };
                ContLinks++; 
                RecursaoOrdenacao(linkedNode.id,vetorMarcacao);
            }
        });
    }

    /********************************************
     *      RESULTADOS APRESENTADOS NA TELA     *  
     *******************************************/
    //Função para mostrar os resultados do algoritmo de ordenação no modal de ordenação 
    function ResultadoNaTelaOrdenacao(){

        //Limpar resultados
        $('#ResultadosOrdenacao').empty(); 
        $('#thead_ordenacao').empty(); 
        $('#tbody_ordenacao').empty(); 

        //Escrever os dados
        $('#ResultadosOrdenacao').append("Passagens"); 

        $('#thead_ordenacao').append('<tr> <th> Passagem </th> <th> De: </th> <th> Para: </th> </tr> ');

        //Escrevendo os dados armazenados no vetor Links
        for(var i=0; i<Links.length; i++){
            $('#tbody_ordenacao').append('<tr>');
            $('#tbody_ordenacao').append('<th> '+i+'</th> <td> '+ Links[i].fromId +' </td> <td> '+ Links[i].toId + '</td>');
            $('#tbody_ordenacao').append('</tr>');
        }

        //Limpa dados anteriores
        $('#alertOrdenacao').empty(); 
        $('#alertOrdenacao').append("Ordem de visita: "); 
        //Escreve a ordem de visita do algoritmo 
        for(var i=0; i<Links.length;i++){
            $('#alertOrdenacao').append(' ' + Links[i].toId+ ' '); 
            if(i != Links.length-1)
                $('#alertOrdenacao').append(' -> '); 
        }
    }

    //Função para mostrar os resultados da busca nos modals de profundidade e largura
    function ResultadoNaTela(vetorDeLinks,tipoDeBusca,vetDist){

        $('#thead_'+tipoDeBusca+'').append('<tr> <th> Passagem </th> <th> Do vértice </th> <th> Para o vértice </th> </tr>')
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i == 0)
                $('#tbody_'+tipoDeBusca+'').append('<tr> <th scope="row"> '+(i+1)+'</th> <td> '+vetorDeLinks[i].fromId +'[V<sub>0</sub>]</td> <td> '+ vetorDeLinks[i].toId +'</td> </tr>');
            else $('#tbody_'+tipoDeBusca+'').append('<tr> <th scope="row"> '+(i+1)+'</th> <td> '+vetorDeLinks[i].fromId +'</td> <td> '+ vetorDeLinks[i].toId +'</td> </tr>');
        }
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i == 0)
                $('#alert'+tipoDeBusca+'Ordem').append(' ('+vetorDeLinks[i].fromId+'[V<sub>0</sub>]->'+vetorDeLinks[i].toId+')');
            else{
                $('#alert'+tipoDeBusca+'Ordem').append(' ('+vetorDeLinks[i].fromId+'->'+vetorDeLinks[i].toId+')');
                if(i != vetorDeLinks.length-1)
                    $('#alert'+tipoDeBusca+'Ordem').append(',');
            }
        }               

        $('#alert'+tipoDeBusca+'Ordem').append(' Fim! Todos os vértices visitados!');

        if(tipoDeBusca == 'Largura'){ //Vetor distância
            $('#thead_Largura_dist').append('<tr>');
            for(var i=0; i<vetDist.length; i++){
                if(i == 0){
                    $('#thead_Largura_dist').append('<th> Vértice: </th>');
                }
                $('#thead_Largura_dist').append('<th> '+ i + ' </th>');
            }
            $('#thead_Largura_dist').append('</tr>');

            $('#tbody_Largura_dist').append('<tr>');
            for(var i=0; i<vetDist.length; i++){
                if(i == 0){
                    $('#tbody_Largura_dist').append('<td> Distância: </td>');
                }
                $('#tbody_Largura_dist').append('<td>'+vetDist[i]+' </td>');
            }
            $('#tbody_Largura_dist').append('</tr>');
        }
    }

    //Mostra os resultados obtidos com o algoritmo Dijkstra
    function ResultadoDijkstra(vetorDeLinks,vetDist){

        LimparDijkstra();

        $('#thead_dijkstra').append('<tr> <th> Passagem </th> <th> Do vértice </th> <th> Para o vértice </th> </tr>');
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i==0)
                $('#tbody_dijkstra').append('<tr> <td> '+ (i+1) +'</td> <td> '+ vetorDeLinks[i].fromId + ' (V<sub>0</sub>) </td> <td> '+ vetorDeLinks[i].toId +'('+ vetorDeLinks[i].peso+ ')  </td> </tr>')
            else $('#tbody_dijkstra').append('<tr> <td> '+ (i+1) +'</td> <td> '+ vetorDeLinks[i].fromId + ' </td> <td> '+ vetorDeLinks[i].toId +'('+ vetorDeLinks[i].peso+ ')  </td> </tr>')
        }

        $('#titulo-dist').empty(); 
        $('#titulo-dist').append('Vetor distancia');

        $('#thead_dijkstra_dist').append('<tr>');
        for(var i=0; i<vetDist.length; i++){
            if(i==0){
                $('#thead_dijkstra_dist').append('<th> Vértice </th>');
            }
            $('#thead_dijkstra_dist').append('<th> '+ i +' </th>');
        }
        $('#thead_dijkstra_dist').append('</tr>');

        //Os dados
        $('tbody_dijkstra_dist').append('<td>');
        for(var i=0; i<vetDist.length; i++){
            if(i==0){
                $('#tbody_dijkstra_dist').append('<th> Distância </th>');
            }
            $('#tbody_dijkstra_dist').append('<td> '+ vetDist[i] +' </td>');
        }
        $('tbody_dijkstra_dist').append('</td>');



    }

    /*****************************************
     *      LIMPAR DADOS ANTERIORES
     *****************************************/

    //Limpa os dados da busca em Largura e profundidade 
    function Limpar(){
        //Limpando busca em profundidade 
        $('#alertProfundidadeOrdem').empty();
        $('#alertProfundidadeOrdem').append('Ordem de visita: ');

        $('#thead_Profundidade').empty(); 
        $('#tbody_Profundidade').empty(); 

        //Limpando busca em largura
        $('#alertLarguraOrdem').empty();
        $('#alertLarguraOrdem').append('Ordem de visita: ');

        $('#thead_Largura').empty(); 
        $('#tbody_Largura').empty(); 

        $('#thead_Largura_dist').empty(); 
        $('#tbody_Largura_dist').empty(); 
    }

    //Limpa os dados do algoritmo de Dijkstra
    function LimparDijkstra(){
        
        $('#thead_dijkstra').empty(); 
        $('#tbody_dijkstra').empty(); 

        $('#thead_dijkstra_dist').empty(); 
        $('#tbody_dijkstra_dist').empty(); 
    } 

    //Limpa os dados do algoritmo de Ordenacao 
    function LimparOrdenacao(){
        $('#aviso_ordenacao').empty(); 
        $('#aviso_ordenacao_comeco').empty(); 
        $('#vetorVerticesOrdenacaoInfo').empty(); 
        $('#vetorOrdenacaoInfo').empty();  
        $('#ResultadosOrdenacao').empty(); 
        $('#thead_ordenacao').empty(); 
        $('#tbody_ordenacao').empty();         
    }

    //Conta quantas arestas chegam em cada vertice e 
    //Armazena no vetor global VetorOrdenacaoTopologica
    function MarcandoArestasDosVertices(){

        //Primeiro zera todo o vetor
        for(var i=0; i<contador; i++){
            vetorOrdenacaoTopologica[i] = 0; 
        }

        //Depois soma um para cada aresta que chega
        //No vértice que está verificando 
        Graph.forEachNode(function(node){
            Graph.forEachLinkedNode(node.id.toString(),function(linkedNode, link){
                if(node.id == link.toId){
                    vetorOrdenacaoTopologica[node.id]++; 
                }
            });
        });
    }
    

