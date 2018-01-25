import { DEFAULT_Λ } from '../default'
import { remove as diacritics } from 'diacritics'
import uncouple from 'uncouple'
import compose from '../helpers/compose'

const { join, every } = uncouple(Array)
const { replace, trim, toLowerCase: lower, split, includes } = uncouple(String)

/**
 * Merge text.
 * @param {string|string[]} value
 * @returns {string}
 */
const merge = (value) => Array.isArray(value) ? join(value, ' ') : value

/**
 * Remove multiple whitespaces.
 * @param {string} value
 * @returns {string}
 */
const whitespaces = (value) => replace(value, /\s{2,}/g, ' ')

/**
 * Normalize text.
 * @param {(string|string[])} value
 * @returns {string}
 */
const normalizeText = compose(lower, whitespaces, trim, diacritics, merge)

const hasTerms = (target) => compose(
  (terms) => every(terms, (term) => includes(target, term)),
  (term) => split(term, ' '),
  normalizeText
)

/**
 * @template T
 * @param {string} terms
 * @param {function(T, number, T[]): (string|Array.<string>)} λ
 * @returns {function(T, number, T[]): boolean}
 */
export default (terms, λ = DEFAULT_Λ) => (...args) => {
  const target = normalizeText(λ(...args))
  const result = hasTerms(target)(terms)
  return result
}
