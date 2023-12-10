import React, { Fragment, ReactComponentElement, useEffect, useRef, useState } from 'react'
import axois from 'axios'
import { Menu, Transition, Combobox } from '@headlessui/react'
import { ChevronDownIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import './App.css'
import './App.scss'

function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

const searchBusinesses = async (
  query: string,
  callback: Function = (_result: unknown) => {}
): Promise<void> => {
  const { data } = await axois.get('http://localhost:3000/businesses.json', {
    params: { search: query },
  })
  callback(data)
  return data
}

const searchUsers = async (
  businessId: string | number,
  query: string,
  callback: Function = (_result: unknown) => {}
): Promise<void> => {
  const { data } = await axois.get('http://localhost:3000/users.json', {
    params: { business_id: businessId, search: query },
  })
  callback(data)
  return data
}

type Business = {
  id: string
  name: string
}

type User = {
  id: string
  first_name: string
  last_name: string
  email: string
}

function App() {
  const [selectedBusiness, setSelectedBusiness] = useState<Option | null>({
    value: 'cool-business',
    label: 'Cool Business',
  })

  const onSelectBusiness = (option: Option) => {
    setSelectedBusiness(option)
  }

  const fetchBusinesses = (value: string, callback: Function) => {
    if (value === '' || value.length < 2) return

    return searchBusinesses(value, callback)
  }

  const fetchUsers = (value: string, callback: Function) => {
    if (selectedBusiness === null) return

    return searchUsers(selectedBusiness.value, value, callback)
  }

  const mapBusinessOptions = (businesses: Business[]) =>
    businesses.map((business) => ({
      value: business.id,
      label: business.name,
      name: business.name,
    }))

  const mapUserOptions = (users: User[]) =>
    users.map((user) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name} (${user.email})`,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    }))

  return (
    <div className="container pt-5">
      <div className="row mb-3">
        <div className="col-md-12">
          <BsAsyncCombobox
            selectedOption={selectedBusiness}
            onSelect={onSelectBusiness}
            fetchData={fetchBusinesses}
            mapOptions={mapBusinessOptions}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <BsAsyncCombobox
            key={`users-${selectedBusiness?.value}`}
            fetchData={fetchUsers}
            mapOptions={mapUserOptions}
            disabled={!selectedBusiness}
            fetchOnLoad={!!selectedBusiness}
            optionDisplay={(option) => (
              <>
                <span className="d-block">{option.name}</span>
                <small className="text-muted"> ({option.email})</small>
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}

type Option = {
  value: string | number
  label: string
  [key: string]: string | number
}

type Callback = React.Dispatch<React.SetStateAction<Option | null>> | ((arg: Option) => void)

type BsAsyncComboboxProps = {
  debounce?: number
  minimumChars?: number
  fetchData: (query: string, callback: (result: Option[]) => void) => void
  onSelect?: Callback
  onInputChange?: (value: string) => void
  mapOptions: (options: any[]) => Option[]
  optionDisplay?: (option: Option) => string | React.ReactElement
  fetchOnLoad?: boolean
  [key: string]: any
}

type BsComboboxProps = {
  options?: Option[]
  selectedOption?: Option | null
  onInputChange?: (value: string) => void
  onSelect?: (option: Option) => void
  displayValue?: (option: Option) => string
  optionDisplay?: (option: Option) => string | React.ReactElement
  emptyOptions?: string | React.ReactElement
  filter?: boolean
  loading?: boolean
  disabled?: boolean
}

const BsAsyncCombobox: React.FC<BsAsyncComboboxProps> = ({
  debounce = 500,
  minimumChars = 2,
  selectedOption = null,
  fetchData,
  mapOptions = (options: unknown) => options as Option[],
  optionDisplay = (option: Option) => option.label,
  onInputChange: theirOnInputChange = (_value: string) => {},
  onSelect: theirOnSelect = (_option: Option) => {},
  fetchOnLoad = false,
  ...rest
}) => {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, debounce)

  const [options, setOptions] = useState<Option[]>([])
  const [selected, setSelected] = useState<Option | null>(selectedOption)
  const mappedOptions = mapOptions(options)

  const [loading, setLoading] = useState(false)

  const emptyOptions =
    debouncedQuery !== '' && loading
      ? 'Loading...'
      : debouncedQuery === ''
      ? 'Search by name or email'
      : 'No results found.'

  useEffect(() => {
    if (debouncedQuery === '' || debouncedQuery.length < minimumChars) {
      if (!fetchOnLoad) return
    }

    setLoading(true)
    fetchData(debouncedQuery, (result) => {
      setOptions(result)
      setLoading(false)
    })
  }, [debouncedQuery, setOptions, setLoading, fetchData])

  const ourOnInputChange = (value: string) => {
    setLoading(value !== '')
    setQuery(value)
    theirOnInputChange(value)
  }

  const ourOnSelect = (option: any) => {
    setSelected(option)
    theirOnSelect(option)
  }

  return (
    <BsCombobox
      options={mappedOptions}
      selectedOption={selected}
      onInputChange={ourOnInputChange}
      onSelect={ourOnSelect}
      displayValue={(option) => option?.label}
      optionDisplay={optionDisplay}
      filter={false}
      loading={loading}
      emptyOptions={
        <li className="relative cursor-default select-none px-4 py-2 text-gray-700">
          {!!loading && (
            <div
              className="spinner-border spinner-border-sm text-secondary me-2"
              role="status"></div>
          )}
          Nothing found
        </li>
      }
      {...rest}
    />
  )
}

const BsCombobox: React.FC<BsComboboxProps> = ({
  options = [],
  selectedOption,
  onInputChange = (_value: string) => {},
  onSelect = (_value: Option) => {},
  displayValue = (option: Option) => option.label,
  optionDisplay = (option: Option) => option.label,
  emptyOptions,
  filter = true,
  loading = false,
  disabled = false,
}) => {
  const [query, setQuery] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value)
    onInputChange(event.target.value)
  }

  const handleSelect = (option: Option) => {
    onSelect(option)
  }

  const filteredOptions =
    !filter || query === ''
      ? options
      : options.filter((option: Option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  if (!emptyOptions) {
    emptyOptions = (
      <li className="relative cursor-default select-none px-4 py-2 text-gray-700">
        {!!loading && (
          <div className="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
        )}
        {emptyOptions
          ? emptyOptions
          : filteredOptions.length === 0 && query !== ''
          ? 'Nothing found.'
          : ''}
      </li>
    )
  }

  return (
    <Menu as="div" className="position-relative">
      <Combobox
        immediate
        disabled={disabled}
        value={selectedOption}
        onChange={handleSelect}
        by={(a, b) => a?.value === b?.value}>
        <div className="position-relative">
          <Combobox.Input
            className="form-control"
            displayValue={displayValue}
            onChange={handleInputChange}
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
          <Combobox.Options className="dropdown-menu show w-100 overflow-y-auto max-height-300">
            {filteredOptions.length === 0
              ? emptyOptions
              : filteredOptions.map((option) => (
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
                          {optionDisplay(option)}
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
                ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    </Menu>
  )
}

export default App
