import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../helpers/auth";
import {getUserProfile,getClientProfileByUserId} from '../../services/auth_services';
import { useState } from "react";
import { postNewOrder } from "../../services/order_services";

export const Order = () => {
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
        console.log(data)
        return;
      }
      alert("pedido registrado!!!");
    });
  };
  

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
    </>
  )
};
