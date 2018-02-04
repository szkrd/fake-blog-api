const pluralize = require('pluralize');

const isNullOrUndefined = x => x === null || x === undefined;

/**
 * Includes one or more many-to-many relationships into `obj`.
 * `resource` is provided for the known side of the association.
 *
 * @param db         lowDB instance
 * @param obj        result item to augment with foreign table
 * @param resource   current table's name
 * @param includes   foreign table's name
 */
function includeTable (db, obj, resource, includes) {
  if (isNullOrUndefined(obj)) {
    return;
  }

  includes && [].concat(includes)
    .forEach((relationship) => {
      if (db.get(relationship).value) {
        let singularResource = pluralize.singular(resource);
        let singularRelationship = pluralize.singular(relationship);
        let manyMany = null;

        // this table lookup could be cached

        if (`${singularResource}_${singularRelationship}` in db.__wrapped__) {
          // e.g. post_tag
          manyMany = `${singularResource}_${singularRelationship}`;
        } else if (`${singularRelationship}_${singularResource}` in db.__wrapped__) {
          // e.g. tag_post
          manyMany = `${singularRelationship}_${singularResource}`;
        } else if (`${resource}_${relationship}` in db.__wrapped__) {
          // e.g. posts_tags
          manyMany = `${resource}_${relationship}`;
        } else if (`${relationship}_${resource}` in db.__wrapped__) {
          // e.g. tags_posts
          manyMany = `${relationship}_${resource}`;
        }

        if (!manyMany) {
          return;
        }

        // assumes many-many tables are firstId, secondId relations.
        const relationshipKey = `${singularRelationship}Id`;
        const resourceKey = `${singularResource}Id`;

        const joinQuery = {};
        joinQuery[resourceKey] = obj.id;

        const items = db.get(manyMany).filter(joinQuery).value();
        if (isNullOrUndefined(items)) {
          // not found
          obj[relationship] = [];
          return;
        }
        const ids = items.map((item) => item[relationshipKey]);

        const related = db.get(relationship).filter((elem) => {
          return ids.includes(elem.id);
        }).value();

        obj[relationship] = related;
      }
    });
}

module.exports = includeTable;
