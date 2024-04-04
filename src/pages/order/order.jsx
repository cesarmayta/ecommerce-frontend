import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../helpers/auth";
import {getUserProfile,getClientProfileByUserId} from '../../services/auth_services';
import { useState } from "react";
import { postNewOrder } from "../../services/order_services";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

export const Order = () => {
  const [newOrder,setNewOrder] = useState({})
  const [clientId,setClientId] = useState(0)
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [address,setAdress] = useState('')
  const [phone,setPhone] = useState('')
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );
  const total = cart.reduce((acc, product) => acc + product.total, 0);

  const initialOptions = {
    clientId: "AUgIpJt4Ub-dYuWLY9db_9DZDWpUXA-0hgPxFD39bt8kg9w-7ACDhFbSTZnTyFpTW0zKsVSljKyudy97",
    currency: "USD",
    intent: "capture",
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  getUserProfile().then((data) => {
    if (data) {
      console.log(data);
      setFirstName(data.first_name)
      setLastName(data.last_name)
      setEmail(data.email)
      getClientProfileByUserId(data.id).then((data)=>{
        console.log(data)
        setClientId(data.id)
        setAdress(data.address);
        setPhone(data.phone);
      })
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    postNewOrder(clientId).then((data) => {
      if (!data) {
        alert("hubo un error");
        return;
      }
      console.log("orden registrada : ",data)
      setNewOrder(data)
      alert("pedido registrado!!!");
    });
  };

  const aprobarPago = () =>{
    alert("pago aprobado")
  }
  

  return(
    <>
    <h1>Confirmar Pedido</h1>
    <form onSubmit={handleSubmit}>
        <h2>Datos del Usuario</h2>
        Nombre : <input type="text" name="firstName" value={firstName}/>
        Apellidos: <input type="text" name="lastName" value={lastName}/>
        Email :<input type="text" name="email" value={email}/>
        <h2>Datos del Cliente</h2>
        Dirección : <input type="text" name="address" value={address}/>
        Telefono : <input type="text" name="phone" value={phone}/>
        <button
          type="submit"
          className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900"
        >
          REGISTRAR PEDIDO
        </button>
    </form>
    <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.length > 0 ? (
            cart.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
                <td>{product.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>Carrito sin productos</td>
            </tr>
          )}
        </tbody>
      </table>
      <span>total : {total}</span><br/>
      {Object.keys(newOrder).length !== 0 && (
        <span>PEDIDO: {newOrder.code}</span>
      )}
      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons 
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total,
                },
                invoice_number: newOrder.code // Pasar el número de factura
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(function(details) {
            console.log("resultado del pedido : ",details)
            const invoiceNumber = details.purchase_units[0].invoice_number; // Obtener el número de factura
            alert('se pago el pedido ' + invoiceNumber);
            // Manejar el número de factura según sea necesario
          });
        }}
        
        />
      </PayPalScriptProvider>
    </>
  )
};
