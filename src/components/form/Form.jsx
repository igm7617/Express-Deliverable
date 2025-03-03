import React from "react";
import s from "./Form.module.css";

export default function Form({ title, desc, handleCreate }) {
  function handleSubmit(params) {
    const title = params.get("title");
    const desc = params.get("desc");

    handleCreate({ title: title, description: desc, is_completed: false });
  }
  return (
    <div className={s.formWrap}>
      <form action={handleSubmit} className={s.form}>
        <input type="text" placeholder="Title" name="title" value={title} />
        <input type="text" placeholder="Description" name="desc" value={desc} />
        <input type="submit" value="Add Task" className={s.submitBtn} />
      </form>
    </div>
  );
}
