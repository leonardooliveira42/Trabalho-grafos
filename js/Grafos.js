//Js direcionado para a inserção e remoção de nós do grafo 

    //Criando um novo Grafo 
    var Graph = Viva.Graph.graph(); 
    var contador = 0; //Será os ids de cada vértice 
    var renderer; 

    //Chamando função para configurar o grafo 
    ConfigurarGrafico(); 
    Direcional(); 

    //Funções para manipular o grafo 
    function InserirVertice (){     //função para inserir um novo vértice

        Graph.addNode(contador);
        contador++; 

        renderer.run(); 
    }
    //Função para ligar um vértice ao outro
    function InserirArestas(){
        //console.log("Inserindo as arestas");

        var verticeSelecionado = $('#selecionar-arestas').val();
        var pesoAresta = $('#peso_aresta').val(); 

        //Lendo os valores do checkbox selecionados 
        var select = document.querySelectorAll("input[type='checkbox']:checked"),
        i = select.length,
        arr = [],
        peso;

        while (i--) {
            arr.push(select[i].value);
        }

        for(var i=0; i<arr.length; i++){
            peso = {
                'from': verticeSelecionado,
                'to':arr[i]           
            }
            Graph.addLink(verticeSelecionado, arr[i],parseInt(pesoAresta));
        }

        Graph.forEachLink(function(link){
            console.dir(link);
            
        })

    }
    //Remoção de um vértice
    function RemoverVertice(){

        var verticeARemover = $('#remover-vertice').val(); 

        Graph.removeNode(verticeARemover);
        //console.log(verticeARemover);
    }
    //Remoção de uma aresta
    function RemoverAresta(){

        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(), 
            segundoVertice = $("#segundo_vertice_aresta_remocao").val(); 

        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id == segundoVertice)
                Graph.removeLink(link);
        });

    }
    //Deletar todo o grafo
    function DeletarGrafo(){
        Graph.forEachNode(function(node){
            Graph.removeNode(node.id); 
        });
        contador = 0; 
        Renderizar(); 

    }

    function ListarVertices (){

        $('#selecionar-arestas').empty(); 
        $('#lista_vertices').empty();       //Limpar os checkboxes
        $('#selecionar-arestas').append('<option selected> Selecione...</option> ')

        Graph.forEachNode(function(node){
           
            $('#selecionar-arestas').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    function ListarArestas(){

        //console.log("listando arestas");
        //Vértice Selecionado
        var verticeSelecionado = $('#selecionar-arestas').val(); 
        //console.log("Vertice selecionado: "+verticeSelecionado);

        $('#lista_vertices').empty(); 

        //Vai pegar o valor selecionado no select e listar as opções de ligação do vértice
        Graph.forEachNode(function(node){
            if(node.id != verticeSelecionado)
                $('#lista_vertices').append('<div class="input-group-text"> <input type="checkbox" name="arestas" value='+node.id+'> Vértice: '+ node.id+'</div>');
        })

    }    

    function ListarVerticeRemoverAresta(){

        $('#primeiro_vertice_aresta_remocao').empty(); 
        $('#segundo_vertice_aresta_remocao').empty(); 

        $('#primeiro_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        Graph.forEachNode(function(node){
            $('#primeiro_vertice_aresta_remocao').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    function ListarRemoverVertice(){

        $('#remover-vertice').empty(); 
        //$('#lista_vertices').empty();       //Limpar os checkboxes
        $('#remover-vertice').append('<option selected> Selecione...</option> ')

        Graph.forEachNode(function(node){
            $('#remover-vertice').append('<option value=' + node.id + '> ' + node.id +' </option>')
        });
    }

    function Direcional(){
        var dir = document.getElementsByName('direcao'), 
            result; 

        for(var i=0; i < dir.length; i++){
            if(dir[i].checked){
                if(dir[i].value == 1){  //Direcional
                    result = true; 
                }else {                 //Não direcional
                    result = false; 
                }                
                break; 
            }
        }
        return result; 
    }

    function InformacoesGrafo(){
        var numeroVertices = 0, 
            numeroArestas = 0,
            ponderado = 'Não ponderado', 
            auxDirecao; 

            Graph.forEachNode(function(node){
                numeroVertices++; 
            });

            Graph.forEachLink(function(link){
                numeroArestas++; 
                if(link.data != 1){
                    ponderado = 'ponderado'; 
                }
            });

            if(numeroVertices == 0){
                $('#conteudoModalInfo').empty(); 
                $('#conteudoModalInfo').append('<div class="alert alert-warning" role="alert"> Não existe nenhum vértice </div>');
            }else {
                //Limpando o alerta
                $('#conteudoModalInfo').empty(); 

                //Info dos vértices 
                $('#numeroVertices').empty(); 
                $('#numeroVertices').append('Número vértices: ' + numeroVertices); 

                //Info das arestas 
                $('#numeroArestas').empty(); 
                $('#numeroArestas').append("Número de arestas: " + numeroArestas);

                //titulo da lista de adjacencia
                $('#tituloTabelaInfo').empty(); 
                $('#tituloTabelaInfo').append('<h1 class="text-center"> Lista de adjacências </h1>');
               if(Direcional()){
                    auxDirecao = 'direcional';
               } else auxDirecao = 'não direcional';
               $('#tituloTabelaInfo').append('<h5 class="text-center"> Grafo '+auxDirecao+' e '+ponderado+' </h5>');

                //Montando o head da tabela
                $('#listaAdjacenciaHead').empty(); 
                $('#listaAdjacenciaHead').append('<th> Vértice </th>');                 
                //Lista os vértices e as suas conexões 
                $('#listaAdjacenciaBody').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaAdjacenciaBody').append('<tr id="verticeInfo'+node.id+'"> <td> '+node.id+' </td> </tr>');
                    Graph.forEachLinkedNode(node.id.toString(),function(linkedNode,aresta){
                        if(Direcional() == false || (Direcional() == true && (node.id == aresta.fromId))){   //Verificando se é direcional ou não
                            $('#verticeInfo'+node.id+'').append('<td>'+linkedNode.id+' ( P: '+aresta.data+ ') </td>')
                        }
                    });
                });               


            }
            //console.log("Numero de vértices: " + numeroVertices + " Numero de arestas: " + numeroArestas);
    }
    

//---------------------------------------------------------------

    //Função para criar grafos pré digitados
    function GerarGrafo(modelos){
        switch(modelos){
            case 1: 
                DeletarGrafo();
                contador = 12; 
                
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                for(var i=0;i<12; i++){
                    if(i != 6)
                        Graph.addLink('6', i,1);
                        //Graph.addLink(i, 6,1);
                }
                break; 
            case 2: 
                //Graph = Viva.Graph.graph(); 
                DeletarGrafo();
                contador = 7; 
                for(var i=0; i<contador; i++){
                    Graph.addNode(i); 
                }

                for(var i=0; i<6; i++){
                    Graph.addLink('0',i+1,1); 
                    //Graph.addLink(i+1,'0');
                }
                
                break; 
            case 3: //Exemplo da sala de aula 
                DeletarGrafo(); 
                contador = 6;
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                //Gerando os links do vértice 1
                Graph.addLink('0','1',1);
                Graph.addLink('0','5',1);
                //Gerando os links do vértice 2
                Graph.addLink('1','2',1);
                Graph.addLink('1','4',1);
                Graph.addLink('1','5',1);
                //Gerando os links do vértice 3
                Graph.addLink('2','3',1);
                Graph.addLink('2','4',1);
                Graph.addLink('2','5',1);
                //Gerando os links do vértice 4
                Graph.addLink('3','4',1);
                //Gerando os links do vértice 5
                Graph.addLink('4','5',1);
            break; 
        }
        Renderizar(); 
    }

//---------------------------------------------------------------
    // CONFIGURAÇÃO VISUAL DO GRAFO 
    function ConfigurarGrafico(){
        var svgGraphics = Viva.Graph.View.svgGraphics(),
        nodeSize = 24;
        svgGraphics.node(function(node){
            //var groupId = node.data.group;
            //node.addLabel('Teste');
            var ui = Viva.Graph.svg('g'),
                legenda = Viva.Graph.svg('text').attr('y', '-20px').text(node.id),
                circle = Viva.Graph.svg('circle')
                .attr('r', nodeSize/2)
                .attr('stroke', '#ccc')
                .attr('stroke-width', '1.5px');

            //circle.append('title').text('teste');
            ui.append(legenda); 
            ui.append(circle); 

            return ui; 

        }).placeNode(function(nodeUI, pos){
            nodeUI.attr('transform','translate(' +
                                  (pos.x - nodeSize/4) + ',' + (pos.y - nodeSize/4) +
                            ')');
        });

        renderer = Viva.Graph.View.renderer(Graph, {
            container : document.getElementById('display-canvas'),
            graphics: svgGraphics      
        });        
    }
    
    //SEMPRE QUE O GRÁFICO PRECISAR SER ATUALIZADO, CHAMAR ESSA FUNÇÃO 
    function Renderizar(){
        renderer.run(); 
    }

    //EVENTOS 
    $("#selecionar-arestas").on('change', function(){ 
        ListarArestas(); 
    });

    $("#primeiro_vertice_aresta_remocao").on('change', function(){ 
        
        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(); 

        $('#segundo_vertice_aresta_remocao').empty();
        $('#segundo_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id != primeiroVertice)
                $('#segundo_vertice_aresta_remocao').append('<option value=' + linkedNode.id + '> ' + linkedNode.id +' </option>');   
        });  
    });

    $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
    });