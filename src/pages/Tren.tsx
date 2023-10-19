import React, { useState, useEffect } from "react";
import "./_list.css";
import ReactDOM from "react-dom";
import { useCallback } from "react";
import generateCredentials from "./auth.js";
import config from "./config.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

export default function Tren() {
  const [viajes, setViajes] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [value, setValue] = useState(271);
  const [value_hasta, setValue_hasta] = useState(318);
  const [horario_suarez, setHorario_suarez] = useState();
  const [horario_retiro, setHorario_retiro] = useState();

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

  //Guardamos el horario a suarez desde miguelete

  useEffect(() => {
    generateToken().then((response) =>
      fetch(config.url + "/estaciones/271/horarios?hasta=190", {
        method: "get",
        headers: new Headers({
          Authorization: response,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (typeof data["results"][0].desde.llegada !== "undefined") {
            var today = new Date();

            var target_date = new Date(data["results"][0].desde.llegada);

            var diferencia_fechas = target_date - today;
            let diferencia_segundos = Math.floor(diferencia_fechas / 1000);

            let diferencia_minutos = Math.floor(diferencia_segundos / 60);
            let diferencia_horas = Math.floor(diferencia_minutos / 60);

            diferencia_segundos = diferencia_segundos % 60;
            diferencia_minutos = diferencia_minutos % 60;
            diferencia_horas = diferencia_horas % 24;

            let string_target = "";

            if (diferencia_horas > 0) {
              string_target =
                "Llega a estación en " +
                diferencia_horas.toString() +
                " y " +
                diferencia_minutos.toString() +
                " minutos.";
            } else {
              if (diferencia_minutos > 0) {
                string_target =
                  "Llega a estación en " + diferencia_minutos + " minutos";
              } else {
                string_target = "Está en estación";
              }
            }

            setHorario_suarez(string_target);
          } else {
            setHorario_suarez("No viene el tren :c");
          }
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  }, []);

  //Guardamos el horario a retiro desde miguelete

  useEffect(() => {
    generateToken().then((response) =>
      fetch(config.url + "/estaciones/271/horarios?hasta=332", {
        method: "get",
        headers: new Headers({
          Authorization: response,
          "Content-Type": "application/json",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (typeof data["results"][0].desde.llegada !== "undefined") {
            var today = new Date();

            var target_date = new Date(data["results"][0].desde.llegada);

            var diferencia_fechas = target_date - today;
            let diferencia_segundos = Math.floor(diferencia_fechas / 1000);

            let diferencia_minutos = Math.floor(diferencia_segundos / 60);
            let diferencia_horas = Math.floor(diferencia_minutos / 60);

            diferencia_segundos = diferencia_segundos % 60;
            diferencia_minutos = diferencia_minutos % 60;
            diferencia_horas = diferencia_horas % 24;

            let string_target = "";

            if (diferencia_horas > 0) {
              string_target =
                "Llega a estación en " +
                diferencia_horas.toString() +
                " y " +
                diferencia_minutos.toString() +
                " minutos.";
            } else {
              if (diferencia_minutos > 0) {
                string_target =
                  "Llega a estación en " + diferencia_minutos + " minutos";
              } else {
                string_target = "Está en estación";
              }
            }

            setHorario_retiro(string_target);
          } else {
            setHorario_retiro("No viene el tren :c");
          }
        })
        .catch((err) => {
          console.log(err.message);
        })
    );
  }, []);

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
      <Container className="p-4">
        <Row>
          {["Primary"].map((variant, idx) => (
            <Card
              bg={variant.toLowerCase()}
              key={idx}
              text={variant.toLowerCase() === "light" ? "dark" : "white"}
              style={{ width: "20%" }}
              className="m-2"
            >
              <Card.Header>Proximo Tren</Card.Header>
              <Card.Body>
                <Card.Title>Miguelete a Suarez </Card.Title>
                <Card.Text>{horario_suarez}</Card.Text>
              </Card.Body>
            </Card>
          ))}

          {["Primary"].map((variant, idx) => (
            <Card
              bg={variant.toLowerCase()}
              key={idx}
              text={variant.toLowerCase() === "light" ? "dark" : "white"}
              style={{ width: "20%" }}
              className="m-2"
            >
              <Card.Header>Proximo Tren</Card.Header>
              <Card.Body>
                <Card.Title>Miguelete a Retiro</Card.Title>
                <Card.Text>{horario_retiro}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>

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
