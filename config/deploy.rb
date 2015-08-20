# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'Stafficiency.co'
set :repo_url, 'git@git.assembla.com:staffing-widget.web.git'

SSHKit.config.command_map[:rake]  = "bundle exec rake"
SSHKit.config.command_map[:rails] = "bundle exec rails"


set :deploy_to, '/srv/www'
set :user, 'lelanderadmin'
set :scm_passphrase, 'DyagCnytazywt22'
set :use_sudo, false
set :deploy_via, 'copy'
set :keep_releases, 5
set :rvm_type, :system

# Default value for :linked_files is []
set :linked_files, fetch(:linked_files, []).push('config/database.yml')

# Default value for linked_dirs is []
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads')

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5

namespace :deploy do

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      # Here we can do anything such as:
      # within release_path do
      #   execute :rake, 'cache:clear'
      # end
    end
  end

end

server 'stafficiency.co', roles: [:app, :web, :db], :primary => true
