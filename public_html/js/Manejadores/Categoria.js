/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    var refCategorias = firebase.database().ref().child("GlotOn").child("Categoria");
    cargarRegistrosFiBa();
    var tblRestaurantes = document.getElementById("tblCategorias");
    
    
    $('#btnGuardarCateg').click(function (event) {
        event.preventDefault();
        var nombre = document.getElementById("NomCateg");
        var urlImagen = document.getElementById("UrlCateg");
        var estado = document.getElementById("EstadoCateg");
        
        
        
        refCategorias.push({
            cat_Nombre: nombre.value,
            cat_Imagen: urlImagen.value,
            cat_Estado: estado.value
        });
        nombre.value = "";
        urlImagen.value = "";
        estado.value = "";
    });
    
    
function cargarRegistrosFiBa()
{
    refCategorias.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].cat_Nombre+ "</td>" +
                        "<td>" + datos[key].cat_Imagen+ "</td>" +
                        "<td>" + datos[key].cat_Estado+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblCategorias.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarCategoria, false);
            }
       }
       
    });
}

function borrarCategoria()
{
    var keyBorrar = this.getAttribute("data");
    var CategoriaBorrar = refCategorias.child(keyBorrar);
    CategoriaBorrar.remove();
    alert("Elemento eliminado");
}

});

