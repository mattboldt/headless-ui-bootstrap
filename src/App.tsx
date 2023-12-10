import { Fragment, useEffect, useRef, useState } from 'react'
import { Menu, Transition, Combobox } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import './App.css'
import './App.scss'

const people = [
  { value: 1, label: 'Wade Cooper' },
  { value: 2, label: 'Arlene Mccoy' },
  { value: 3, label: 'Devon Webb' },
  { value: 4, label: 'Tom Cook' },
  { value: 5, label: 'Tanya Fox' },
  { value: 6, label: 'Hellen Schmidt' },
]

function App() {
  const [selected, setSelected] = useState(people[0])
  const [query, setQuery] = useState('')

  return (
    <div className="container pt-5">
      <BsCombobox options={people} displayValue={(option) => option.label} />

      <div className="p-5">Gap</div>
      <Menu as="div" className="dropdown">
        <Menu.Button className="btn btn-primary dropdown-toggle" type="button">
          Options
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items as="ul" className="dropdown-menu show">
            <Menu.Item as="li">
              {({ active }) => (
                <a href="#" className={`dropdown-item ${active ? 'active' : ''}`}>
                  Edit
                </a>
              )}
            </Menu.Item>
            <Menu.Item as="li">
              {({ active }) => (
                <a href="#" className={`dropdown-item ${active ? 'active' : ''}`}>
                  Duplicate
                </a>
              )}
            </Menu.Item>

            <Menu.Item as="li">
              {({ active }) => (
                <a href="#" className={`dropdown-item ${active ? 'active' : ''}`}>
                  Archive
                </a>
              )}
            </Menu.Item>
            <Menu.Item as="li">
              {({ active }) => (
                <a href="#" className={`dropdown-item ${active ? 'active' : ''}`}>
                  Move
                </a>
              )}
            </Menu.Item>

            <Menu.Item as="li">
              {({ active }) => (
                <a href="#" className={`dropdown-item ${active ? 'active' : ''}`}>
                  Delete
                </a>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

const BsCombobox = ({ options = [], displayValue = (option) => option.label }) => {
  const [selected, setSelected] = useState(options[0])
  const [query, setQuery] = useState('')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <Menu as="div" className="position-relative">
      <Combobox immediate value={selected} onChange={setSelected}>
        <div className="position-relative">
          <Combobox.Input
            className="form-control"
            displayValue={displayValue}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Combobox.Button className="position-absolute top-0 end-0 btn btn-link">
            <ChevronUpDownIcon className="h-5 w-5 text-dark" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery('')}>
          <Combobox.Options className="dropdown-menu show w-100">
            {filteredOptions.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.value}
                  className={({ active }) =>
                    `relative cursor-default select-none ${
                      active ? 'bg-teal-600 text-white' : 'text-gray-900'
                    }`
                  }
                  value={option}>
                  {({ selected, active }) => (
                    <a
                      className={`dropdown-item ${
                        selected ? 'active fw-bold' : active ? 'bg-primary-subtle text-dark' : ''
                      }`}
                      href="#">
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? 'text-white' : 'text-teal-600'
                          }`}>
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </a>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </Menu>
  )
}

export default App
