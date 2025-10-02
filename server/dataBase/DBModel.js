/**
 * 通用MySQL操作类，风格类似thinkPHP，支持链式调用
 * 用法：const model = new Model('user'); await model.where({id:1}).select();
 */
const mysql = require('mysql');
const  db  = require('../dataBaseConfig');

const pool = mysql.createPool(db);

class Model {
	constructor(table) {
		this.table = table;
		this._where = '';
		this._fields = '*';
		this._order = '';
		this._limit = '';
		this._data = null;
	}

	where(whereObj) {
		if (!whereObj || Object.keys(whereObj).length === 0) {
			this._where = '';
			return this;
		}
		const arr = [];
		for (const key in whereObj) {
			arr.push(`\`${key}\`=${mysql.escape(whereObj[key])}`);
		}
		this._where = `WHERE ${arr.join(' AND ')}`;
		return this;
	}

	fields(fields) {
		if (Array.isArray(fields)) {
			this._fields = fields.map(f => `\`${f}\``).join(',');
		} else if (typeof fields === 'string') {
			this._fields = fields;
		}
		return this;
	}

	order(orderStr) {
		this._order = orderStr ? `ORDER BY ${orderStr}` : '';
		return this;
	}

	limit(offset, count) {
		if (typeof offset === 'number' && typeof count === 'number') {
			this._limit = `LIMIT ${offset},${count}`;
		} else if (typeof offset === 'number') {
			this._limit = `LIMIT ${offset}`;
		}
		return this;
	}

	data(dataObj) {
		this._data = dataObj;
		return this;
	}

	async select() {
		const sql = `SELECT ${this._fields} FROM \`${this.table}\` ${this._where} ${this._order} ${this._limit}`.replace(/\s+/g, ' ').trim();
		return this.query(sql);
	}

	async find() {
		this.limit(1);
		const rows = await this.select();
		return rows[0] || null;
	}

	async insert() {
		if (!this._data) throw new Error('No data to insert');
		const sql = `INSERT INTO \`${this.table}\` SET ?`;
		return this.query(sql, this._data);
	}

	async update() {
		console.log('this._data:',this._data);
		if (!this._data) throw new Error('No data to update');
		if (!this._where) throw new Error('Update must have where condition');
		const sql = `UPDATE \`${this.table}\` SET ? ${this._where}`;
		return this.query(sql, this._data);
	}

	async delete() {
		if (!this._where) throw new Error('Delete must have where condition');
		const sql = `DELETE FROM \`${this.table}\` ${this._where}`;
		return this.query(sql);
	}
	async count() {
		const sql = `SELECT COUNT(*) as total FROM \`${this.table}\` ${this._where}`.replace(/\s+/g, ' ').trim();
		const rows = await this.query(sql);
		return Number(rows[0]?.total) || 0;
	}
	query(sql, params) {
		return new Promise((resolve, reject) => {
			pool.query(sql, params, (err, results) => {
				if (err) return reject(err);
				resolve(results);
			});
		});
	}
}

module.exports = Model;