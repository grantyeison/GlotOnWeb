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
    var select=document.getElementById("cbCategoria");
    //select.addEventListener("click", cargarCBBox, false);    
    var PlatoEditar;
    
    $('#btnGuardarPlato').click(function (event) 
    {
        event.preventDefault();
        var nombre = document.getElementById("NombrePlato");
        var imagen = document.getElementById("ImagenPlato");
        var estado = document.getElementById("cbEstado");
        var categoria = document.getElementById("cbCategoria");
        
        if (accionGuardar === "editar")
        {
            PlatoEditar.update({
            Nombre: nombre.value,
            Imagen: imagen.value,
            Estado: estado.value,
            Categoria: categoria.value
        });
        }
        else if(accionGuardar === "guardar")
        {
            refPlatos.push({
            Nombre: nombre.value,
            Imagen: imagen.value,
            Estado: estado.value,
            Categoria: categoria.value
        });
        }
        
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
                        '<td> <button class = "btn btn-info editar" data='+key+'> <span class=" glyphicon glyphicon-pencil "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblPlatos.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarPlato, false);
                elementosEditables[i].addEventListener("click", cargarPlato, false);
            }
       }
       
    });
    
    //sección de llenado del comboBox (dropdownList)
    var refCat = firebase.database().ref().child("GlotOn").child("Categoria");
    var consultaCategorias;
    var opcion= document.getElementById("cbCategoria");//nombre del comboBox en el html
    refCat.orderByChild("cat_Nombre").on("child_added", function(snapshot)//función para la consulta
    {
        consultaCategorias=snapshot.val();
        var nOpcion= document.createElement("option");//el tipo de elemento html a crear
        nOpcion.value=consultaCategorias.cat_Nombre;
        nOpcion.text=consultaCategorias.cat_Nombre;
        opcion.appendChild(nOpcion);
    });
}
function cargarPlato()
{
    var nombre = document.getElementById("NombrePlato");
    var imagen = document.getElementById("ImagenPlato");
    var estado = document.getElementById("cbEstado");
    var categoria = document.getElementById("cbCategoria");
    
    var keyBuscar = this.getAttribute("data");
    PlatoEditar = refPlatos.child(keyBuscar);
    PlatoEditar.once("value",function(snap)
    {
        var datos = snap.val();
        nombre.value = datos.Nombre;
        imagen.value = datos.Imagen;
        estado.value = datos.Estado;
        categoria.value = datos.Categoria;
    });
    document.getElementById("btnGuardarPlato").value = "Editar plato";
    accionGuardar = "editar";
}
function borrarPlato()
{
    var keyBorrar = this.getAttribute("data");
    var PlatoBorrar = refPlatos.child(keyBorrar);
    PlatoBorrar.remove();
    alert("Elemento eliminado");
}

});

