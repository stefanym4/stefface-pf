//algoritmo con un condicional, ciclo y función.
//aplicar codigo de descuento y hacer la operación


function AplicarDescuento(){
  let codigo = document.getElementById("codigoDescuento").value;
  let precio = document.getElementById("precioArticulo").value;

  if(codigo === "543"){
    let descuento = precio - (precio * 7.000 );
    document.getElementById("precioConDescuento").value = descuento.toFixed(2);
  } else if (codigo === "544"){
    let descuento = precio - (precio * 10.000);
    document.getElementById("precioConDescuento").value = descuento.toFixed(2);
  } else {
    document.getElementById("precioConDescuento").value = "Código de descuento no válido";
  }

 localStorage.setItem("ultimoCodigoDescuento", codigo);
}
function ObtenerUltimoCodigo(){
    let codigo = localStorage.getItem("ultimoCodigoDescuento");
  
    
    if(codigo !== null){
      document.getElementById("codigoDescuento").value = codigo;
    }
  }
 


//variables
let allContainerCart = document.querySelector('.products');
let containerBuyCart = document.querySelector('.card-items');
let priceTotal = document.querySelector('.price-total')
let amountProduct = document.querySelector('.count-product');


let buyThings = [];
let totalCard = 0;
let countProduct = 0;

//functions
loadEventListenrs();
loadCart();

function loadEventListenrs(){
    allContainerCart.addEventListener('click', addProduct);

    containerBuyCart.addEventListener('click', deleteProduct);
}

function addProduct(e){
    e.preventDefault();
    if (e.target.classList.contains('btn-add-cart')) {
        const selectProduct = e.target.parentElement; 
        readTheContent(selectProduct);
    }
}

function deleteProduct(e) {
    if (e.target.classList.contains('delete-product')) {
        const deleteId = e.target.getAttribute('data-id');

        buyThings.forEach(value => {
            if (value.id == deleteId) {
                let priceReduce = parseFloat(value.price) * parseFloat(value.amount);
                totalCard =  totalCard - priceReduce;
                totalCard = totalCard.toFixed(2);
            }
        });
        buyThings = buyThings.filter(product => product.id !== deleteId);
        
        countProduct--;
    }
    
    if (buyThings.length === 0) {
        priceTotal.innerHTML = 0;
        amountProduct.innerHTML = 0;
    }
    loadHtml();
    saveCart();
}

function readTheContent(product){
    const infoProduct = {
        image: product.querySelector('div img').src,
        title: product.querySelector('.title').textContent,
        price: product.querySelector('div p span').textContent,
        id: product.querySelector('a').getAttribute('data-id'),
        amount: 1
    }

    totalCard = parseFloat(totalCard) + parseFloat(infoProduct.price);
    totalCard = totalCard.toFixed(2);

    const exist = buyThings.some(product => product.id === infoProduct.id);
    if (exist) {
        const pro = buyThings.map(product => {
            if (product.id === infoProduct.id) {
                product.amount++;
                return product;
            } else {
                return product
            }
        });
        buyThings = [...pro];
    } else {
        buyThings = [...buyThings, infoProduct]
        countProduct++;
    }
    loadHtml();
    saveCart();
}

function loadHtml(){
    clearHtml();
    buyThings.forEach(product => {
        const {image, title, price, amount, id} = product;
        const row = document.createElement('div');
        row.classList.add('item');
        row.innerHTML = `
            <img src="${image}" alt="">
            <div class="item-content">
                <h5>${title}</h5>
                <h5 class="cart-price">${price}$</h5>
                <h6>Amount: ${amount}</h6>
            </div>
            <span class="delete-product" data-id="${id}">X</span>
        `;

        containerBuyCart.appendChild(row);

        priceTotal.innerHTML = totalCard;

        amountProduct.innerHTML = countProduct;
    });
}

function clearHtml(){
    containerBuyCart.innerHTML = '';
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(buyThings));
}

function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    buyThings = JSON.parse(savedCart);
    totalCard = buyThings.reduce((total, product) => total + parseFloat(product.price) * parseFloat(product.amount), 0).toFixed(2);
    countProduct = buyThings.reduce((total, product) => total + product.amount, 0);
    loadHtml();
  } else {
    buyThings = [];
    totalCard = 0;
    countProduct = 0;
  }
  priceTotal.innerHTML = totalCard;
  amountProduct.innerHTML = countProduct;
}


 //pagina somos 


 function registrar() {
    let usuario = document.getElementById("usuario").value;
    let contrasenia = document.getElementById("contrasenia").value;
  
   
    localStorage.setItem(usuario, contrasenia);
  
    
    document.getElementById("usuario").value = "";
    document.getElementById("contrasenia").value = "";
  
    alert("Registrado con éxito! Puede ahora iniciar sesión.");
  }

  function iniciarSesion() {
    let usuario = document.getElementById("usuario").value;
    let contrasenia = document.getElementById("contrasenia").value;
  
    
    let registroContrasenia = localStorage.getItem(usuario);
  
    
    if (contrasenia === registroContrasenia) {
      alert("Inició sesión con éxito! Bienvenido " + usuario);
      
      window.location.href = "inicio.html";
    } else {
      alert("Nombre de usuario o contraseña incorrectos. Por favor, intente de nuevo.");
    }
  
   
    document.getElementById("usuario").value = "";
    document.getElementById("contrasenia").value = "";
  }
    

  // para adjuntar una api
const loadDetailsBtn = document.querySelector('.load-details-btn');
const productDetailsEl = document.querySelector('.product-details');

// botón
loadDetailsBtn.addEventListener('click', function() {
  //Obtiene el ID del producto del atributo data
  const productId = loadDetailsBtn.getAttribute('data-product-id');


  fetchProductDetails(productId);
});

//Método para cargar los detalles del producto
function fetchProductDetails(productId) {
  
  fetch(`https://world.openbeautyfacts.org/api/v0/product/${productId}.json`)
    .then(response => response.json())
    .then(data => {
      
      const productDetailsHTML = `
        <h2>${data.product_name}</h2>
        <p>${data.brands_tags.join(', ')}</p>
        <p>${data.ingredients_text}</p>
        <img src="${data.image_url}">
      `;

     
      productDetailsEl.innerHTML = productDetailsHTML;
    })
    .catch(error => {
      console.error('Error al cargar los detalles del producto', error);
    });
}