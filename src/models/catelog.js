import * as constants from "../common/constants"

export class Datasets {
  constructor(events) {
    this.datasets = events.map(e => new Dataset(e));
  }
}

export class Dataset {
  constructor(fields) {
    switch (fields.kind) {
      case constants.DATASET_KINDS.CATELOG:
        return new Catelog(fields.id, fields.name, fields.todo);
      case constants.DATASET_KINDS.EXTERN:
        return new Extern(fields.id, fields.name, fields.todo);
      case constants.DATASET_KINDS.INDEX:
        return new Index(fields.id, fields.name, fields.todo);
      case constants.DATASET_KINDS.KVSTORE:
        return new KVStore(fields.id, fields.name, fields.todo);
      case constants.DATASET_KINDS.TOPIC:
        return new Topic(fields.id, fields.name, fields.todo);
      case constants.DATASET_KINDS.VIEW:
        return new View(fields.id, fields.name, fields.query);
    }
  }
}

class DatasetBase {
  constructor(id, name, kind) {
    if (!constants.DATASET_KINDS.includes(kind)){
      throw `Dataset kind unkown: ${kind}`
    }
    this.id = id;
    this.name = name;
    this.kind = kind;
  }
  setRules(rules) {
    if (this.kind !== constants.DATASET_KINDS.VIEW) {
      this.rules = rules;
    } else {
      throw "setRules not applicable for View."
    }
  }
}

export class Catelog extends DatasetBase {
  constructor(id, name, todo) {
    super(id, name, constants.DATASET_KINDS.CATELOG);
    this.todo = todo
  }
}

export class Extern extends DatasetBase {
  constructor(id, name, todo) {
    super(id, name, constants.DATASET_KINDS.EXTERN);
    this.todo = todo
  }
}

export class Index extends DatasetBase {
  constructor(id, name, todo) {
    super(id, name, constants.DATASET_KINDS.INDEX);
    this.todo = todo
  }
}

export class KVStore extends DatasetBase {
  constructor(id, name, todo) {
    super(id, name, constants.DATASET_KINDS.KVSTORE);
    this.todo = todo
  }
}

export class Topic extends DatasetBase {
  constructor(id, name, todo) {
    super(id, name, constants.DATASET_KINDS.TOPIC);
    this.todo = todo
  }
}

export class View extends DatasetBase{
  constructor(id, name, query) {
    super(id, name, constants.DATASET_KINDS.VIEW);
    this.query = query
  }
}

// export class Rule {

// }

// class Action {
//   constructor(kind) {
//     if (!Object.keys(constants.ACTION_KINDS).includes(kind)) {
//       throw `Action kind unkown: ${kind}`
//     }
//     this.kind = kind
//   }
// }

// class ExtractAction {

// }

// export class AliasAction  extends Action {
//   constructor(field, alias) {
//     this.field = field;
//     this.alias = alias;
//     this.kind = constants.ACTION_KINDS.ALIAS
//   }
// }

// export class AutoKVAction extends Action {

// }

// export class EvalAction extends Action {

// }

// export class LookupAction extends Action {

// }

// export class RegexAction  extends Action {

// }