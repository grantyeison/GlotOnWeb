/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    //variables para la conexión con firebase
    var refCartas = firebase.database().ref().child("GlotOn").child("Carta");
    var storageRef = firebase.storage().ref().child("GlotOn");
    //variables iniciales
    var tblCartas = document.getElementById("tblCartas");
    //variables auxiliares
    var accionGuardar = "guardar";
    var CartaEditar;
    //carga de datos que se encuentran en Firebase
    cargarRegistrosFiBa();
    
    
    $('#btnResetCarta').click(function(event){
        document.getElementById("RestCarta").value = "";
        document.getElementById("IngCarta").value = "";
        document.getElementById("PlatoCarta").value = "";
        document.getElementById("DescCarta").value = "";
        document.getElementById("PrecCarta").value = "";
        document.getElementById("EstCarta").value = "";
        document.getElementById("btnGuardarCarta").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    $('#btnGuardarCarta').click(function (event) {
        event.preventDefault();
        var restaurante = document.getElementById("RestCarta");
        var ingredientes = document.getElementById("IngCarta");
        var plato = document.getElementById("PlatoCarta");
        var descripcion = document.getElementById("DescCarta");
        var precio = document.getElementById("PrecCarta");
        var estado = document.getElementById("EstCarta");
        if (accionGuardar === "editar")
        {
            CartaEditar.update({
                Restaurante: restaurante.value,
                Ingredientes: ingredientes.value,
                Estado: estado.value,
                Plato: plato.value,
                Descripcion: descripcion.value,
                Precio: precio.value
            });
        }
        else if(accionGuardar === "guardar")
        {
            refCartas.push({
                Restaurante: restaurante.value,
                Ingredientes: ingredientes.value,
                Estado: estado.value,
                Plato: plato.value,
                Descripcion: descripcion.value,
                Precio: precio.value
            });
        }
        
        restaurante.value = "";
        ingredientes.value = "";
        plato.value = "";
        descripcion.value = "";
        precio.value = "";
        estado.value = "";
        document.getElementById("btnGuardarCarta").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    
function cargarRegistrosFiBa()
{
    refCartas.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].Plato+ "</td>" +
                        "<td>" + datos[key].Descripcion+ "</td>" +
                        "<td>" + datos[key].Ingredientes+ "</td>" +
                        "<td>" + datos[key].Restaurante+ "</td>" +
                        "<td>" + datos[key].Precio+ "</td>" +
                        "<td>" + datos[key].Estado+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        '<td> <button class = "btn btn-info editar" data='+key+'> <span class=" glyphicon glyphicon-pencil "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblCartas.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarCarta, false);
                elementosEditables[i].addEventListener("click", cargarCarta, false);
            }
       }
       
    });
}

function cargarCarta()
{
    var restaurante = document.getElementById("RestCarta");
    var ingredientes = document.getElementById("IngCarta");
    var plato = document.getElementById("PlatoCarta");
    var descripcion = document.getElementById("DescCarta");
    var precio = document.getElementById("PrecCarta");
    var estado = document.getElementById("EstCarta");
    
    var keyBuscar = this.getAttribute("data");
    CartaEditar = refCartas.child(keyBuscar);
    CartaEditar.once("value",function(snap){
        var datos = snap.val();
        restaurante.value = datos.Restaurante;
        ingredientes.value = datos.Ingredientes;
        plato.value = datos.Plato;
        descripcion.value = datos.Descripcion;
        precio.value = datos.Precio;
        estado.value = datos.Estado;
    });
    document.getElementById("btnGuardarCarta").value = "Editar restaurante";
    accionGuardar = "editar";
}

function borrarCarta()
{
    var keyBorrar = this.getAttribute("data");
    var CartaBorrar = refCartas.child(keyBorrar);
    CartaBorrar.remove();
}


});

