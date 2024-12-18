import e from "express";
import { get } from "http";

class EmployeeModel {
    constructor({id, email, hashed_password, first_name, last_name, phone_number, address, birth_date, role, business_id, hire_date}) {
        this.id = id;
        this.email = email;
        this.hashed_password = hashed_password;
        this.first_name = first_name;
        this.last_name = last_name;
        this.phone_number = phone_number;
        this.address = address;
        this.birth_date = birth_date;
        this.role = role;
        this.business_id = business_id;
        this.hire_date = hire_date;
    }

    setBusinessId = (business_id) => {
        this.business_id = business_id;
    }

    getAll = async (pool, business_id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.business_id = $1
                ORDER BY e.id;
            `, [business_id]);

            const results = result.rows.map(row => {
                // clean up the result object
                if(row['hashed_password']) {
                    delete row['hashed_password'];
                }

                if(row['employee_id']) {
                    delete row['employee_id'];
                }

                return row;
            });

            return results;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }

    getById = async (pool, id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmailForAuth = async (pool, email) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.email = $1;
            `, [email]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];
            // clean up the result object

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getByEmail = async (pool, email) => {
        const emp = await this.getByEmailForAuth(pool, email);
        if(emp) {
            if(emp['hashed_password']) {
                delete emp['hashed_password'];
            }
        }
        return emp;
    }

    register = async (pool, verified=0) => {
        try {
            // INSERT INTO EMPLOYEE (role, hashed_password)
            // then insert into EMPLOYEE_PROFILE (first_name, last_name, email)
            await pool.query('BEGIN');
            const result = await pool.query(`
                INSERT INTO employee (role, email, hashed_password, business_id, verified)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (email) DO NOTHING
                RETURNING id;
            `, [this.role, this.email, this.hashed_password, this.business_id, verified]);
            
            if(result.rows.length === 0) {
                await pool.query('ROLLBACK');
                return {error: 'Employee Email already exists'};
            }

            const employeeId = result.rows[0].id;

            await pool.query(`
                INSERT INTO employee_profile (employee_id, first_name, last_name, phone_number, address, birth_date, hire_date)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `, [employeeId, this.first_name, this.last_name, this.phone_number, this.address, this.birth_date, this.hire_date]);

            this.id = employeeId;
            await pool.query('COMMIT');

            return {employeeId: employeeId};
        }
        catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return {error: 'Error registering employee'};
        }
    }

    updateProfile = async (pool, employeeId, empData) => {
        try {
            await pool.query('BEGIN');
            
            // Check if the email already exists for another employee
            const emailCheck = await pool.query(`
                SELECT id 
                FROM employee 
                WHERE email = $1 AND id != $2;
            `, [empData.email, employeeId]);
    
            if (emailCheck.rows.length > 0) {
                await pool.query('ROLLBACK');
                return false; // Email already exists
            }
    
            // Update the employee email
            await pool.query(`
                UPDATE employee 
                SET email = $1, role = $2
                WHERE id = $3;
            `, [empData.email, empData.role, employeeId]);
    
            // Update the employee profile
            await pool.query(`
                UPDATE employee_profile 
                SET first_name = $1, last_name = $2, phone_number = $3, address = $4,
                birth_date = $5,
                hire_date = $6,
                profile_picture_url = $7
                WHERE employee_id = $8;
            `, [
                empData.first_name,
                empData.last_name,
                empData.phone_number,
                empData.address,
                empData.birth_date,
                empData.hire_date,
                empData.profile_picture_url,
                employeeId
            ]);
    
            await pool.query('COMMIT');
            return true; // Update successful
        } catch (error) {
            await pool.query('ROLLBACK');
            console.error('Database query error:', error);
            return false; // Error occurred
        }
    }

    getSummary = async (pool, employee_id) => {
        try {
            const result = await pool.query(`
                SELECT *
                FROM employee e
                LEFT JOIN employee_profile ep
                ON e.id = ep.employee_id
                WHERE e.id = $1;
            `, [employee_id]);

            if(result.rows.length === 0) {
                return {};
            }

            const results = result.rows[0];

            // clean up the result object
            if(results['hashed_password']) {
                delete results['hashed_password'];
            }

            if(results['employee_id']) {
                delete results['employee_id'];
            }

            const badges_result = await pool.query(`
                SELECT eb.*, b.*
                FROM employee e
                JOIN EMPLOYEE_BADGE eb
                ON e.id = eb.employee_id
                JOIN BADGE b
                ON eb.badge_id = b.id
                WHERE e.id = $1;
            `, [employee_id]);

            const deals_result = await pool.query(`
                SELECT e.id as employee_id,
                CAST(COUNT(od.id) AS INT) as open_deals_count,
                CAST(COUNT(cd.id) AS INT) as claimed_deals_count,
                CAST(COUNT(cw.id) AS INT) as closed_won_deals_count,
                CAST(COUNT(cl.id) AS INT) as closed_lost_deals_count
                FROM employee e
                LEFT JOIN deal od
                ON e.id = od.deal_opener AND od.status = 0
                LEFT JOIN deal cd
                ON e.id = cd.deal_executor AND cd.status = 1
                LEFT JOIN deal cw
                ON e.id = cw.deal_executor AND cw.status = 2
                LEFT JOIN deal cl
                ON e.id = cl.deal_executor AND cl.status = 3
                WHERE e.id = $1
                GROUP BY e.id;
            `, [employee_id]);

            const customers_result = await pool.query(`
                SELECT CAST(COUNT(c.id) as int) as customers_count
                FROM customer c
                WHERE c.added_by = $1;
            `, [employee_id]);


            const targets_result = await pool.query(`
                SELECT *
                FROM target t
                WHERE t.employee_id = $1;
            `, [employee_id]);

            results.badges = badges_result.rows;
            results.deals = deals_result.rows.length && deals_result.rows[0];
            results.customers = customers_result.rows.length && customers_result.rows[0];
            results.targets = targets_result.rows;

            return results;

        }
        catch (error) {
            console.error('Database query error:', error);
            return {};
        }
    }

    getAllSummary = async (pool, business_id) => {
        try {
           // same as getSummary but for all employees
              const result = await pool.query(`
                 SELECT *
                 FROM employee e
                 LEFT JOIN employee_profile ep
                 ON e.id = ep.employee_id
                 WHERE e.business_id = $1;
                `, [business_id]);
    
                const employees = result.rows.map(row => {
                 // clean up the result object
                 if(row['hashed_password']) {
                      delete row['hashed_password'];
                 }
    
                 if(row['employee_id']) {
                      delete row['employee_id'];
                 }
    
                 return row;
                });
    
                for (let i = 0; i < employees.length; i++) {
                 const employee = employees[i];
                 const summary = await this.getSummary(pool, employee.id);
                    employee.badges = summary.badges;
                    employee.deals = summary.deals;
                    employee.customers = summary.customers;
                    employee.targets = summary.targets;

                    employees[i] = employee;
                }

                return employees;
        }
        catch (error) {
            console.error('Database query error:', error);
            return [];
        }
    }
    
}

export default EmployeeModel;