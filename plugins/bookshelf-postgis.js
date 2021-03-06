'use strict'

/*!
 * Bookshelf-PostGIS
 *
 * Copyright 2017 Josh Swan
 * Released under the MIT license
 * https://github.com/joshswan/bookshelf-postgis/blob/master/LICENSE
 */

const get = require('lodash/get');
const omit = require('lodash/omit');
const set = require('lodash/set');
const wkx = require('wkx');

module.exports = (bookshelf) => {
    const BaseModel = bookshelf.Model;

    bookshelf.Model = BaseModel.extend({
        geography: null,
        geometry: null,

        format(attributes) {
            let omitFields = [];

            // Convert geography attributes to raw ST_MakePoint calls with [lon, lat] as bindings
            if (this.geography) {
                Object.keys(this.geography).forEach((key) => {
                    const fields = Array.isArray(this.geography[key]) ? this.geography[key] : ['lng', 'lat'];
                    const values = fields.map(field => get(attributes, field)).filter(value => typeof value === 'number');

                    if (values.length === 2) {
                        attributes[key] = bookshelf.knex.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography', values);
                    }

                    omitFields = [...omitFields, ...fields];
                });
            }

            // Convert geometry attributes to raw ST_GeomFromGeoJSON and stringify GeoJSON attributes
            if (this.geometry) {
                this.geometry.forEach((attr) => {
                    if (attributes[attr]) attributes[attr] = bookshelf.knex.raw('ST_GeomFromGeoJSON(?)', [JSON.stringify(attributes[attr])]);
                });
            }

            // Call parent format method
            return BaseModel.prototype.format.apply(this, [omit(attributes, omitFields)]);
        },

        parse(attributes) {
            let omitFields = [];

            // Parse geography columns to specified fields
            if (this.geography) {
                Object.keys(this.geography).forEach((key) => {
                    if (attributes[key]) {
                        const fields = Array.isArray(this.geography[key]) ? this.geography[key] : ['lng', 'lat'];

                        wkx.Geometry.parse(Buffer.from(attributes[key], 'hex')).toGeoJSON().coordinates.forEach((coordinate, index) => {
                            set(attributes, fields[index], coordinate);
                        });

                        omitFields.push(key)
                    }
                });
            }

            // Parse geometry columns to GeoJSON
            if (this.geometry) {
                this.geometry.forEach((attr) => {
                    if (attributes[attr]) attributes[attr] = wkx.Geometry.parse(Buffer.from(attributes[attr], 'hex')).toGeoJSON();
                });
            }

            // Call parent parse method
            return BaseModel.prototype.parse.apply(this, [omit(attributes, omitFields)]);
        },
    });
};