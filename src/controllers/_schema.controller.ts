
/**
 * @swagger
 * components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
 *        bearerFormat: JWT
 *    parameters:
 *        id:
 *          in: path
 *          name: id
 *          required: true
 *          type: string
 *          format: uuid
 *          description: Entity ID
 *        take:
 *          in: query
 *          name: take
 *          schema:
 *            type: integer
 *            format: int32
 *          required: false
 *          description: Number of elements per request
 *        skip:
 *          in: query
 *          name: take
 *          schema:
 *            type: integer
 *            format: int32
 *          required: false
 *          description:  Number of elements to skip per request
 *        searchQuery:
 *          in: query
 *          name: query
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by search query, to search for name, email, and phone
 *        type:
 *          in: query
 *          name: type
 *          schema:
 *            type: string
 *            enum:
 *             - Particulier
 *             - Entreprise
 *          required: false
 *          description:  Filter by type
 *        gender:
 *          in: query
 *          name: gender
 *          schema:
 *            type: string
 *            enum:
 *              - M.
 *              - F.
 *          required: false
 *          description:  Filter by customer gender
 *        zipCode:
 *          in: query
 *          name: zipCode
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by zipCode
 *        city:
 *          in: query
 *          name: city
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by city
 *        country:
 *          in: query
 *          name: country
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by country
 *        companyId:
 *          in: query
 *          name: companyId
 *          schema:
 *            type: string
 *          required: false
 *          description:  Filter by companyId
 *        statut:
 *          in: query
 *          name: statut
 *          schema:
 *            type: string
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 *          required: false
 *          description:  Filter by statut
 *    schemas:
 *      IdBody:
 *          type: object
 *          properties:
 *              id:
 *                  type: string
 *                  format: uuid
 *                  description: Entity ID
 *                  required: true
 *      CreateCustomer:
 *        type: object
 *        properties:
 *          type:
 *            type: string
 *            example: Particulier
 *            description: Customer Type
 *            required: true
 *            enum:
 *              - Particulier
 *              - Entreprise
 *          gender:
 *            type: string
 *            example: M.
 *            description: Customer Gender
 *            required: true
 *            enum:
 *              - M.
 *              - F.
 *          firstname:
 *            type: string
 *            example: Mehdi
 *            description: Customer first name
 *            required: true
 *          lastname:
 *            type: string
 *            example: Jai
 *            description: Customer last name
 *            required: true
 *          phone:
 *            type: string
 *            example: +21261234638
 *            description: Customer phone number
 *            required: true
 *          email:
 *            type: string
 *            format: email
 *            example: mail@mail.com
 *            description: Customer email
 *            required: true
 *          adresse:
 *            type: string
 *            example: street 1 av 1 city, country
 *            description: Customer address
 *            required: false
 *          zipCode:
 *            type: string
 *            example: 20000
 *            description: Customer address zip code
 *            required: false
 *          city:
 *            type: string
 *            example: Casablanca
 *            description: Customer address city
 *            required: false
 *          country:
 *            type: string
 *            example: Morocco
 *            description: Customer address country
 *            required: false
 *          companyId:
 *            type: string
 *            format: uuid
 *            description: Customer linked company uuid
 *            required: false
 *          statut:
 *            type: string
 *            description: Customer status
 *            required: false
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 *      UpdateCustomer:
 *        type: object
 *        properties:
 *          id:
 *            type: string
 *            format: uuid
 *            description: Customer id
 *            required: true
 *          type:
 *            type: string
 *            example: Particulier
 *            description: Customer Type
 *            required: true
 *            enum:
 *              - Particulier
 *              - Entreprise
 *          gender:
 *            type: string
 *            example: M.
 *            description: Customer Gender
 *            required: true
 *            enum:
 *              - M.
 *              - F.
 *          firstname:
 *            type: string
 *            example: Mehdi
 *            description: Customer first name
 *            required: true
 *          lastname:
 *            type: string
 *            example: Jai
 *            description: Customer last name
 *            required: true
 *          phone:
 *            type: string
 *            example: +21261234638
 *            description: Customer phone number
 *            required: true
 *          email:
 *            type: string
 *            format: email
 *            example: mail@mail.com
 *            description: Customer email
 *            required: true
 *          adresse:
 *            type: string
 *            example: street 1 av 1 city, country
 *            description: Customer address
 *            required: false
 *          zipCode:
 *            type: string
 *            example: 20000
 *            description: Customer address zip code
 *            required: false
 *          city:
 *            type: string
 *            example: Casablanca
 *            description: Customer address city
 *            required: false
 *          country:
 *            type: string
 *            example: Morocco
 *            description: Customer address country
 *            required: false
 *          companyId:
 *            type: string
 *            format: uuid
 *            description: Customer linked company uuid
 *            required: false
 *          statut:
 *            type: string
 *            description: Customer status
 *            required: false
 *            enum:
 *              - Active
 *              - Inactive
 *              - Encours
 */