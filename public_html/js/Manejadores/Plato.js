/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () 
{
    var refPlatos = firebase.database().ref().child("GlotOn").child("Plato");
    cargarRegistrosFiBa();
    var tblPlatos = document.getElementById("tblPlatos");
    
    
    $('#btnGuardarPlato').click(function (event) 
    {
        event.preventDefault();
        var nombre = document.getElementById("NombrePlato");
        var imagen = document.getElementById("ImagenPlato");
        var estado = document.getElementById("EstadoPlato");
        var categoria = document.getElementById("CategoriaPlato");

        refPlatos.push({
            Nombre: nombre.value,
            Imagen: imagen.value,
            Estado: estado.value,
            Categoria: categoria.value
        });
        nombre.value = "";
        imagen.value = "";
        estado.value = "";
        categoria.value = "";
    });
    
    
function cargarRegistrosFiBa()
{
    refPlatos.on("value", function(snap)
    {
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].Nombre+ "</td>" +
                        "<td>" + datos[key].Imagen+ "</td>" +
                        "<td>" + datos[key].Estado+ "</td>" +
                        "<td>" + datos[key].Categoria+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblPlatos.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarPlato, false);
            }
       }
       
    });
}

function borrarPlato()
{
    var keyBorrar = this.getAttribute("data");
    var PlatoBorrar = refPlatos.child(keyBorrar);
    PlatoBorrar.remove();
    alert("Elemento eliminado");
}

});

