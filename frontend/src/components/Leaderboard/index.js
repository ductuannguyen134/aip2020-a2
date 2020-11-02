import React, { useEffect, useState } from "react";
import "./styles.css";
import axios from "../../hoc/axios";
import DataTable from "react-data-table-component";
import { useLoading } from "../../hoc/LoadingContext/LoadingContext";

const ACTIVE_COLUMNS = [
  { name: "Username", selector: "userName", sortable: false },
  {
    name: "Number of resolved requests",
    selector: "completedRequest",
    sortable: true,
    right: true,
  },
];

const DEBT_COLUMNS = [
  { name: "Username", selector: "userDetail[0].userName", sortable: false },
  {
    name: "Number of debts",
    selector: "totalDebt",
    sortable: true,
    right: true,
  },
];

function Leaderboard(props) {
  const [activeLists, setActiveLists] = useState();
  const [debtLists, setDebtLists] = useState([]);
  const [loading, setLoading] = useLoading();

  useEffect(() => {
    async function fetchData() {
      setLoading((prev) => !prev);
      const url = props.type === "active" ? "/api/user/users" : "/api/favor/top";
      let data;
      try {
        const res = await axios.get(url);
        data = res.data;
        setLoading((prev) => !prev);
      } catch (err) {
        alert(err);
      }

      let rows;
      if (props.type === "active") {
        rows = data.sort((a, b) => {
          return b.completedRequest - a.completedRequest;
        });
        setActiveLists(rows);
      } else {
        rows = data.sort((a, b) => {
          return a.totalDebt - b.totalDebt;
        });

        setDebtLists(rows);
      }
    }

    fetchData();
  }, []);

  return (
    <DataTable
      title={
        props.type === "active"
          ? "Most Active Users"
          : "Users with the least debts"
      }
      columns={props.type === "active" ? ACTIVE_COLUMNS : DEBT_COLUMNS}
      data={props.type === "active" ? activeLists : debtLists}
      pagination={true}
      keyField="_id"
      highlightOnHover={true}
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 15]}
    />
  );
}

export default Leaderboard;
