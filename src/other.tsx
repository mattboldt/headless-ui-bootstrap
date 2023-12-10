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
