import React, { useState, useEffect } from "react";
import "./_list.css";
import ReactDOM from "react-dom";
import { useCallback } from "react";
import generateCredentials from "./auth.js";
import config from "./config.js";

export default function Tren() {
  const [viajes, setViajes] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [value, setValue] = useState(271);
  const [value_hasta, setValue_hasta] = useState(318);
  const loadMore = useCallback(
    (viajes) => {
      setViajes(viajes);
    },
    [setViajes]
  );

  function generateToken() {
    return fetch("https://apiarribos.sofse.gob.ar/v1/auth/authorize", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({
        username: generateCredentials().username,
        password: generateCredentials().password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        return data.token;
      });
  }

  function ViajeList(props) {
    return (
      <div className="viajes-list">
        {viajes.map(
          (
            viaje,
            index // Repeat list items using the map function
          ) => (
            <div key={`user-${index}`} className="user-list__item">
              <div className="user-list__name">Desde: {viaje.desde.nombre}</div>
              <div className="user-list__address">
                Hasta: {viaje.hasta.nombre}
              </div>
              <div className="user-list__country">
                Horario de Salida:{" "}
                {new Date(viaje.desde.llegada).toLocaleString()}
              </div>
              <div className="user-list__country">
                Horario de Llegada:{" "}
                {new Date(viaje.hasta.llegada).toLocaleString()}
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  function showViajes(desde, hasta) {
    generateToken().then((response) =>
      fetch(config.url + "/estaciones/" + desde + "/horarios?hasta=" + hasta, {
        method: "get",
        headers: new Headers({
          Authorization: response,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setViajes(data["results"]);
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
    loadMore(viajes);
  }

  useEffect(() => {
    generateToken().then((response) =>
      fetch(config.url + "/estaciones/332/horarios?hasta=271", {
        method: "get",
        headers: new Headers({
          Authorization: response,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setViajes(data["results"]);
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  }, []);

  useEffect(() => {
    generateToken().then((response) =>
      fetch(config.url + "/estaciones/buscar?lineas=5", {
        method: "get",
        headers: new Headers({
          Authorization: response,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data["results"]);
          setEstaciones(data["results"]);
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  }, []);

  return (
    <>
      <h2>Estación de Salida</h2>
      <select
        name="select-salida"
        onChange={(event) => setValue(event.target.value)}
      >
        {estaciones.map((x, y) =>
          x.id != 271 ? (
            <option value={x.id}>{x.nombreCorto}</option>
          ) : (
            <option value={x.id} selected>
              {x.nombreCorto}
            </option>
          )
        )}
      </select>

      <h2>Estación de Llegada</h2>
      <select
        name="select-hasta"
        onChange={(event) => setValue_hasta(event.target.value)}
      >
        {estaciones.map((x, y) =>
          x.id != 318 ? (
            <option value={x.id}>{x.nombreCorto}</option>
          ) : (
            <option value={x.id} selected>
              {x.nombreCorto}
            </option>
          )
        )}
      </select>

      <button onClick={() => showViajes(value, value_hasta)}>
        Ver proximos viajes
      </button>

      <h2>Viajes</h2>
      <div className="generic-viajes-list">
        <ViajeList> </ViajeList>
      </div>
    </>
  );
}
